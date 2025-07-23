import 'package:flutter/material.dart';
import 'package:excg/services/lifi_service.dart';
import 'package:web3dart/web3dart.dart';

class SwapPage extends StatefulWidget {
  const SwapPage({super.key});

  @override
  _SwapPageState createState() => _SwapPageState();
}

class _SwapPageState extends State<SwapPage> {
  final LifiService _lifiService = LifiService();
  final TextEditingController _amountController = TextEditingController();
  String _selectedFromChain = '1';
  String _selectedToChain = '1';
  String _selectedFromToken = 'ETH';
  String _selectedToToken = 'USDC';
  String _walletAddress = '0xYourWalletAddress';
  String _status = '';

  // Mappature per catene e token
  final Map<String, String> chainIdToName = {
    '1': 'Ethereum',
    '56': 'Binance Smart Chain',
    '137': 'Polygon',
    '42161': 'Arbitrum',
    '10': 'Optimism',
  };

  final Map<String, String> tokenSymbolToAddress = {
    'ETH': '0x0000000000000000000000000000000000000000',
    'USDC': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    'DAI': '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    'MATIC': '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
  };

  Future<void> _performSwap() async {
    setState(() => _status = 'Inizio processo...');
    
    try {
      // 1. Ottieni la quotazione
      setState(() => _status = 'Richiesta quotazione...');
      
      final quote = await _lifiService.getSwapQuote(
        fromToken: tokenSymbolToAddress[_selectedFromToken]!,
        toToken: tokenSymbolToAddress[_selectedToToken]!,
        fromAddress: _walletAddress,
        fromChainId: _selectedFromChain,
        toChainId: _selectedToChain,
        amount: _amountController.text,
      );

      setState(() => _status = 'Quotazione ricevuta. Esecuzione swap...');
      
      // 2. Esegui lo swap
      final status = await _lifiService.executeSwap(
        routeId: quote.routeId,
        fromAddress: _walletAddress,
      );

      // 3. Controlla lo stato
      setState(() => _status = 'Stato: ${status.status}');
      
      if (status.status == 'COMPLETED') {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Swap completato!')),
        );
      }
    } catch (e) {
      setState(() => _status = 'Errore: ${e.toString()}');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Errore: ${e.toString()}')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Krustycoin Swap')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Selezione catena e token in input
            Row(
              children: [
                Expanded(
                  child: DropdownButton<String>(
                    value: _selectedFromChain,
                    items: chainIdToName.entries.map((e) {
                      return DropdownMenuItem(
                        value: e.key,
                        child: Text(e.value),
                      );
                    }).toList(),
                    onChanged: (value) => setState(() => _selectedFromChain = value!),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: DropdownButton<String>(
                    value: _selectedFromToken,
                    items: tokenSymbolToAddress.keys.map((symbol) {
                      return DropdownMenuItem(
                        value: symbol,
                        child: Text(symbol),
                      );
                    }).toList(),
                    onChanged: (value) => setState(() => _selectedFromToken = value!),
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 20),
            
            // Selezione catena e token in output
            Row(
              children: [
                Expanded(
                  child: DropdownButton<String>(
                    value: _selectedToChain,
                    items: chainIdToName.entries.map((e) {
                      return DropdownMenuItem(
                        value: e.key,
                        child: Text(e.value),
                      );
                    }).toList(),
                    onChanged: (value) => setState(() => _selectedToChain = value!),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: DropdownButton<String>(
                    value: _selectedToToken,
                    items: tokenSymbolToAddress.keys.map((symbol) {
                      return DropdownMenuItem(
                        value: symbol,
                        child: Text(symbol),
                      );
                    }).toList(),
                    onChanged: (value) => setState(() => _selectedToToken = value!),
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 20),
            
            // Campo importo
            TextField(
              controller: _amountController,
              decoration: const InputDecoration(
                labelText: 'Importo',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
            ),
            
            const SizedBox(height: 30),
            
            // Pulsante di swap
            ElevatedButton(
              onPressed: _performSwap,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text('ESEGUI SWAP', style: TextStyle(fontSize: 18)),
            
            const SizedBox(height: 20),
            
            // Stato dell'operazione
            Text(_status, textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}