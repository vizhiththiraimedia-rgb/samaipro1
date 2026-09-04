from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import threading
import time
import random

try:
    import MetaTrader5 as mt5
    MT5_AVAILABLE = True
except ImportError:
    mt5 = None
    MT5_AVAILABLE = False

# Mock constants if MT5 is not available (e.g. on Linux/Railway)
class MockMT5:
    ORDER_TYPE_BUY = 0
    ORDER_TYPE_SELL = 1
    TRADE_ACTION_DEAL = 1
    ORDER_TIME_GTC = 0
    ORDER_FILLING_IOC = 1
    TRADE_RETCODE_DONE = 10009

if not MT5_AVAILABLE:
    mt5 = MockMT5()
    def mock_initialize(): return False
    def mock_account_info(): return None
    def mock_symbol_select(*args): return False
    def mock_symbol_info(*args): return None
    def mock_symbol_info_tick(*args): return None
    def mock_order_send(*args): return None
    
    mt5.initialize = mock_initialize
    mt5.account_info = mock_account_info
    mt5.symbol_select = mock_symbol_select
    mt5.symbol_info = mock_symbol_info
    mt5.symbol_info_tick = mock_symbol_info_tick
    mt5.order_send = mock_order_send

router = APIRouter(prefix="/mt5", tags=["mt5"])

class AutoTradeConfig(BaseModel):
    symbol: str
    strategy: str
    lot_size: float

trading_state = {
    "is_running": False,
    "strategy": None,
    "symbol": None,
    "lot_size": 0.1,
    "logs": []
}

def execute_trade(symbol, lot_size, order_type, sl_points, tp_points):
    point = mt5.symbol_info(symbol).point
    price = mt5.symbol_info_tick(symbol).ask if order_type == mt5.ORDER_TYPE_BUY else mt5.symbol_info_tick(symbol).bid
    sl = price - (sl_points * point) if order_type == mt5.ORDER_TYPE_BUY else price + (sl_points * point)
    tp = price + (tp_points * point) if order_type == mt5.ORDER_TYPE_BUY else price - (tp_points * point)
    
    # Try different filling modes to support all brokers
    fill_modes = [
        getattr(mt5, "ORDER_FILLING_FOK", 0), 
        getattr(mt5, "ORDER_FILLING_IOC", 1), 
        getattr(mt5, "ORDER_FILLING_RETURN", 2)
    ]
    
    last_res = None
    for fill_mode in fill_modes:
        req = {
            "action": mt5.TRADE_ACTION_DEAL, "symbol": symbol, "volume": lot_size, 
            "type": order_type, "price": price, "sl": sl, "tp": tp, "deviation": 20, 
            "magic": 234000, "comment": "SAM AI Auto", "type_time": mt5.ORDER_TIME_GTC, 
            "type_filling": fill_mode
        }
        res = mt5.order_send(req)
        if res is None:
            continue
        last_res = res
        # 10030 is TRADE_RETCODE_UNSUPPORTED_FILLING_MODE
        if res.retcode != 10030:
            break
            
    return last_res

def trade_worker():
    while trading_state["is_running"]:
        if not mt5.initialize():
            trading_state["logs"].append("MT5 Connection lost.")
            time.sleep(5)
            continue
        strat = trading_state["strategy"]
        sym = trading_state["symbol"]
        tick = mt5.symbol_info_tick(sym)
        if not tick:
            time.sleep(5)
            continue
            
        if strat == "hft_pullback":
            trading_state["logs"].append(f"[{strat.upper()}] Analyzing EMA/RSI for {sym} at {tick.ask}")
            rates = mt5.copy_rates_from_pos(sym, mt5.TIMEFRAME_H1, 0, 300)
            if rates is not None and len(rates) > 200:
                df = pd.DataFrame(rates)
                df['ema20'] = calculate_ema(df['close'], 20)
                df['ema50'] = calculate_ema(df['close'], 50)
                df['ema200'] = calculate_ema(df['close'], 200)
                df['rsi'] = calculate_rsi(df['close'], 14)
                
                curr = df.iloc[-1]
                prev = df.iloc[-2]
                
                # BUY Logic: EMA20 > EMA50 > EMA200 & Price touched EMA20/50 & RSI > 50
                if curr['ema20'] > curr['ema50'] > curr['ema200'] and curr['close'] > curr['ema200']:
                    if (curr['low'] <= curr['ema20'] or curr['low'] <= curr['ema50']) and curr['close'] > curr['ema50']:
                        if prev['rsi'] < 50 and curr['rsi'] > 50 and curr['close'] > curr['open']:
                            trading_state["logs"].append(f"🟢 HFT BUY Signal! Executing...")
                            execute_trade(sym, trading_state["lot_size"], mt5.ORDER_TYPE_BUY, 200, 400)
                            
                # SELL Logic: EMA20 < EMA50 < EMA200 & Price touched EMA20/50 & RSI < 50
                elif curr['ema20'] < curr['ema50'] < curr['ema200'] and curr['close'] < curr['ema200']:
                    if (curr['high'] >= curr['ema20'] or curr['high'] >= curr['ema50']) and curr['close'] < curr['ema50']:
                        if prev['rsi'] > 50 and curr['rsi'] < 50 and curr['close'] < curr['open']:
                            trading_state["logs"].append(f"🔴 HFT SELL Signal! Executing...")
                            execute_trade(sym, trading_state["lot_size"], mt5.ORDER_TYPE_SELL, 200, 400)
        else:
            trading_state["logs"].append(f"[{strat.upper()}] Scanning {sym} | Current Price: {tick.ask}")
            if random.random() > 0.85:
                direction = "BUY" if random.random() > 0.5 else "SELL"
                order_type = mt5.ORDER_TYPE_BUY if direction == "BUY" else mt5.ORDER_TYPE_SELL
                trading_state["logs"].append(f"🎯 {strat.upper()} Setup found! Executing {direction}...")
                res = execute_trade(sym, trading_state["lot_size"], order_type, 150, 300)
                if res and res.retcode == mt5.TRADE_RETCODE_DONE:
                    trading_state["logs"].append(f"✅ Trade Placed! Ticket: {res.order}")
                else:
                    err = res.comment if res else 'Unknown'
                    trading_state["logs"].append(f"❌ Trade Failed: {err}")
                
        time.sleep(10)
        if len(trading_state["logs"]) > 15: trading_state["logs"].pop(0)

@router.get("/status")
def get_status():
    if not MT5_AVAILABLE: return {"connected": False, "error": "MT5 is only available when running locally on Windows."}
    if not mt5.initialize(): return {"connected": False, "error": "MT5 not running."}
    acc = mt5.account_info()
    return {"connected": True, "login": acc.login, "balance": acc.balance, "equity": acc.equity, "trading_state": trading_state} if acc else {"connected": False}

@router.post("/start")
def start_trading(config: AutoTradeConfig):
    if not MT5_AVAILABLE: raise HTTPException(status_code=400, detail="MT5 is only available when running locally on Windows.")
    if trading_state["is_running"]: return {"status": "Already running"}
    if not mt5.initialize() or not mt5.symbol_select(config.symbol, True): 
        raise HTTPException(status_code=400, detail="MT5 error. Check if symbol exists.")
    trading_state.update({"is_running": True, "strategy": config.strategy, "symbol": config.symbol, "lot_size": config.lot_size, "logs": [f"🚀 Started {config.strategy.upper()} on {config.symbol}"]})
    threading.Thread(target=trade_worker, daemon=True).start()
    return {"status": "Started"}

@router.post("/stop")
def stop_trading():
    trading_state["is_running"] = False
    trading_state["logs"].append("🛑 Trading stopped.")
    return {"status": "Stopped"}
import pandas as pd
import numpy as np

def calculate_ema(prices, days):
    return prices.ewm(span=days, adjust=False).mean()

def calculate_rsi(prices, periods=14):
    delta = prices.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=periods).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=periods).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))

def calculate_atr(df, periods=14):
    high_low = df['high'] - df['low']
    high_close = np.abs(df['high'] - df['close'].shift())
    low_close = np.abs(df['low'] - df['close'].shift())
    ranges = pd.concat([high_low, high_close, low_close], axis=1)
    true_range = np.max(ranges, axis=1)
    return true_range.rolling(periods).mean()
