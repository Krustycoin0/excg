import 'package:lifi_flutter/lifi_flutter.dart';

class LifiService {
  final Lifi _lifi = Lifi();

  Future<Quote> getSwapQuote({
    required String fromToken,
    required String toToken,
    required String fromAddress,
    required String fromChainId,
    required String toChainId,
    required String amount,
  }) async {
    try {
      final request = QuoteRequest(
        fromToken: fromToken,
        toToken: toToken,
        fromAddress: fromAddress,
        fromChainId: fromChainId,
        toChainId: toChainId,
        amount: amount,
      );

      return await _lifi.getQuote(request);
    } catch (e) {
      throw Exception("Errore nella quotazione: ${e.toString()}");
    }
  }

  Future<SwapStatus> executeSwap({
    required String routeId,
    required String fromAddress,
  }) async {
    try {
      final executeRequest = ExecuteSwapRequest(
        routeId: routeId,
        fromAddress: fromAddress,
      );

      return await _lifi.executeSwap(executeRequest);
    } catch (e) {
      throw Exception("Errore nell'esecuzione: ${e.toString()}");
    }
  }
}