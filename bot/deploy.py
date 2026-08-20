#!/usr/bin/env python3
"""
HyperSentinel Contract Deployment Script for GenLayer Studio / Testnet
"""
import sys
import os

def main():
    print("=" * 60)
    print("   Deploying HyperSentinelCourt to GenLayer Testnet")
    print("=" * 60)
    
    contract_path = os.path.join(os.path.dirname(__file__), "..", "contracts", "HyperSentinelCourt.py")
    if not os.path.exists(contract_path):
        print(f"Error: Contract file not found at {contract_path}")
        sys.exit(1)

    with open(contract_path, "r", encoding="utf-8") as f:
        code = f.read()

    print(f"Contract loaded successfully ({len(code)} bytes).")
    print("Deploy via GenLayer Studio UI:")
    print("1. Open https://studio.genlayer.com/")
    print("2. Paste contents of HyperSentinelCourt.py")
    print("3. Pass operator address (e.g. 0x09fae1aafadb0a3b8382e43ed8d2d56ba92171c3)")
    print("4. Click Deploy Intelligent Contract.")
    print("=" * 60)

if __name__ == "__main__":
    main()
