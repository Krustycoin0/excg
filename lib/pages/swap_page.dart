import 'package:flutter/material.dart';
import 'package:excg/services/lifi_service.dart';
import 'package:excg/services/wallet_service.dart';
import 'package:provider/provider.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';

class SwapPage extends StatefulWidget {
  const SwapPage({Key? key}) : super(key: key);

  @override
  _SwapPageState createState() => _SwapPageState();
}

class _SwapPageState extends State<SwapPage> {
  final TextEditingController _amountController = TextEditingController();
  String _selectedFromChain = '1';
  String _selectedToChain = '1';
  String _selectedFromToken = 'ETH';
  String _selectedToToken = 'USDC';
  String _status = '';
  bool _isLoading = false;
  QRViewController? _qrController;
  bool _showQrScanner = false;
  final GlobalKey _qrKey = GlobalKey(debugLabel: 'QR');

  @override
  void dispose() {
    _qrController?.dispose();
    super.dispose();
  }

  // Mappature per catene e token
  final Map<String, String> chainIdToName = {
    '1': 'Ethereum',
    '56': 'Binance Smart Chain',
    '137': 'Polygon',
    '42161': 'Arbitrum',
    '10': 'Optimism',
    '5': 'Goerli Testnet',
  };

  final Map<String, Map<String, dynamic>> tokens = {
    'ETH': {
      'address': '0x0000000000000000000000000000000000000000',
      'decimals': 18,
    },
    'USDC': {
      'address': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      'decimals': 6,
    },
    'DAI': {
      'address': '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      'decimals': 18,
    },
    'WETH': {
      'address': '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      'decimals': 18,
    },
    'USDT': {
      'address': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      'decimals': 6,
    },
    'TEST': {
      'address': '0x7af963cF6D228E564e2A0aA0DdBF06210B38615D',
      'decimals': 18,
    },
  };

  String _toWei(String amount, int decimals) {
    final bigAmount = BigInt.from(double.parse(amount) * BigInt.from(10).pow(decimals);
    return bigAmount.toString();
  }

  Future<void> _performSwap(WalletService walletService) async {
    if (walletService.currentAddress == null) {
      setState(() => _status = 'Connetti un wallet prima!');
      return;
    }

    setState(() {
      _isLoading = true;
      _status = 'Inizio processo...';
    });

    try {
      final fromToken = tokens[_selectedFromToken]!;
      final amountInWei = _toWei(_amountController.text, fromToken['decimals']);

      setState(() => _status = 'Richiesta quotazione...');
      
      final lifiService = LifiService();
      final quote = await lifiService.getSwapQuote(
        fromToken: fromToken['address'],
        toToken: tokens[_selectedToToken]!['address'],
        fromAddress: walletService.currentAddress!,
        fromChainId: _selectedFromChain,
        toChainId: _selectedToChain,
        amount: amountInWei,
      );

      setState(() => _status = 'Quotazione ricevuta. Esecuzione swap...');
      
      final status = await lifiService.executeSwap(
        routeId: quote.routeId,
        fromAddress: walletService.currentAddress!,
      );

      setState(() => _status = 'Stato: ${status.status}');
      
      if (status.status == 'COMPLETED') {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Swap completato con successo!')),
        );
      }
    } catch (e) {
      setState(() => _status = 'Errore: ${e.toString()}');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Errore durante lo swap: ${e.toString()}')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Widget _buildQrScanner() {
    return Stack(
      children: [
        QRView(
          key: _qrKey,
          onQRViewCreated: (controller) {
            _qrController = controller;
            controller.scannedDataStream.listen((scanData) {
              if (scanData.code != null) {
                // Gestisci l'indirizzo scansionato
                debugPrint("Scanned address: ${scanData.code}");
                _qrController!.pauseCamera();
                setState(() => _showQrScanner = false);
              }
            });
          },
          overlay: QrScannerOverlayShape(
            borderColor: Colors.blue,
            borderRadius: 10,
            borderLength: 30,
            borderWidth: 10,
            cutOutSize: MediaQuery.of(context).size.width * 0.8,
          ),
        ),
        Positioned(
          top: 40,
          left: 20,
          child: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () {
              _qrController?.dispose();
              setState(() => _showQrScanner = false);
            },
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final walletService = Provider.of<WalletService>(context);

    if (_showQrScanner) {
      return _buildQrScanner();
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Krustycoin Swap'),
        actions: [
          if (walletService.currentAddress != null)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Row(
                children: [
                  Text(
                    '${walletService.currentAddress!.substring(0, 6)}...${walletService.currentAddress!.substring(walletService.currentAddress!.length - 4)}',
                    style: const TextStyle(fontSize: 16),
                  ),
                  IconButton(
                    icon: const Icon(Icons.exit_to_app),
                    onPressed: walletService.disconnectWallet,
                  ),
                ],
              ),
            ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  if (walletService.currentAddress == null)
                    Column(
                      children: [
                        const Text('Connetti un wallet per iniziare', style: TextStyle(fontSize: 18)),
                        const SizedBox(height: 20),
                        ElevatedButton(
                          onPressed: walletService.connectToWallet,
                          child: const Text('Connetti Wallet', style: TextStyle(fontSize: 18)),
                        const SizedBox(height: 10),
                        TextButton(
                          onPressed: () => setState(() => _showQrScanner = true),
                          child: const Text('Scansiona QR Code'),
                        ),
                      ],
                    ),
                  if (walletService.currentAddress != null) ...[
                    // UI per lo swap
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
                            items: tokens.keys.map((symbol) {
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
                            items: tokens.keys.map((symbol) {
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
                    TextField(
                      controller: _amountController,
                      decoration: const InputDecoration(
                        labelText: 'Importo',
                        border: OutlineInputBorder(),
                      ),
                      keyboardType: TextInputType.number,
                    ),
                    const SizedBox(height: 30),
                    ElevatedButton(
                      onPressed: () => _performSwap(walletService),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: const Text('ESEGUI SWAP', style: TextStyle(fontSize: 18)),
                    const SizedBox(height: 20),
                    Text(_status, textAlign: TextAlign.center, style: const TextStyle(fontSize: 16)),
                  ],
                ],
              ),
            ),
    );
  }
}