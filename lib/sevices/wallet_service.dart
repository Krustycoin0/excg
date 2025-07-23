import 'package:walletconnect_flutter/walletconnect_flutter.dart';

class WalletService {
  WalletConnect? connector;
  String? _currentAddress;
  String? _currentChain;

  Future<void> initWalletConnect() async {
    connector = WalletConnect(
      bridge: 'https://bridge.walletconnect.org',
      clientMeta: const PeerMeta(
        name: 'Krustycoin Swap',
        description: 'Swap app using Li.Fi',
        url: 'https://krustycoin.app',
        icons: ['https://krustycoin.app/icon.png'],
      ),
    );

    if (connector!.connected) {
      _currentAddress = connector!.session.accounts[0];
      _currentChain = connector!.session.chainId.toString();
    }
  }

  Future<String?> connectToWallet() async {
    if (connector == null) await initWalletConnect();

    if (!connector!.connected) {
      try {
        final session = await connector!.createSession(
          chainId: 1,
          onDisplayUri: (uri) async {
            debugPrint("WalletConnect URI: $uri");
          },
        );
        
        _currentAddress = session.accounts[0];
        _currentChain = session.chainId.toString();
        return _currentAddress;
      } catch (e) {
        debugPrint("WalletConnect error: $e");
        return null;
      }
    }
    return _currentAddress;
  }

  Future<void> disconnectWallet() async {
    if (connector != null && connector!.connected) {
      await connector!.killSession();
    }
    _currentAddress = null;
    _currentChain = null;
  }

  String? get currentAddress => _currentAddress;
  String? get currentChain => _currentChain;
}