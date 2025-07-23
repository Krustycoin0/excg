import 'package:flutter/material.dart';
import 'package:excg/pages/swap_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Krustycoin Exchange',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const SwapPage(),
      debugShowCheckedModeBanner: false,
    );
  }
}