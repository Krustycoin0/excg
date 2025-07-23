import 'package:lifi_flutter/lifi_flutter.dart';

class LifiService {
  final Lifi _lifi;

  LifiService() : _lifi = Lifi(
    apiKey: '37f3b0ae-58d0-423a-a895-133cd60f2b72.20bd41f0-014e-4389-9dfa-9eaefb8589e5',
    baseUrl: 'https://li.quest', // Aggiungi questa linea
  );

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

      final quote = await _lifi.getQuote(request);
      
      // Debug: Stampa la risposta della quotazione
      print("Quote Response: ${quote.toJson()}");
      
      return quote;
    } catch (e, stack) {
      print("Quote Error: $e");
      print("Stack Trace: $stack");
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

      final status = await _lifi.executeSwap(executeRequest);
      
      // Debug: Stampa lo stato dello swap
      print("Swap Status: ${status.toJson()}");
      
      return status;
    } catch (e, stack) {
      print("Execution Error: $e");
      print("Stack Trace: $stack");
      throw Exception("Errore nell'esecuzione: ${e.toString()}");
    }
  }
}