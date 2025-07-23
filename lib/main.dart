import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:excg/pages/swap_page.dart';
import 'package:excg/services/wallet_service.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => WalletService(),
      child: MaterialApp(
        title: 'Krustycoin Exchange',
        theme: ThemeData(
          primarySwatch: Colors.blue,
          visualDensity: VisualDensity.adaptivePlatformDensity,
        ),
        home: const SwapPage(),
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}