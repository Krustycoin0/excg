
import { useCallback, useState } from "react";
import { ethers } from "ethers";

export const FEE_COLLECTOR_ADDRESS = "0xFD825e57383f42d483a81EF4caa118b859538540";
export const FEE_PERCENTAGE = 0.003; // 0.3%

interface EVMFeeResult {
  txHash?: string;
  feeAmount: number;
  feeInWei: string;
  error?: string;
}

export function useEVMFeeCollection() {
  const [isCollecting, setIsCollecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Invia le fee in ETH/MATIC/BNB (native token)
   * @param swapAmount Importo totale dello swap in ETH/MATIC/BNB
   */
  const sendNativeFee = useCallback(async (swapAmount: number): Promise<EVMFeeResult> => {
    setIsCollecting(true);
    setError(null);
    
    try {
      if (!window.ethereum) throw new Error("Wallet non rilevato. Installa MetaMask!");
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Calcola la fee (0.3% dello swap)
      const feeAmount = swapAmount * FEE_PERCENTAGE;
      
      // Converti in wei (1 ETH = 10^18 wei)
      const feeInWei = ethers.utils.parseEther(feeAmount.toString()).toString();
      
      // Invia la transazione
      const tx = await signer.sendTransaction({
        to: FEE_COLLECTOR_ADDRESS,
        value: feeInWei
      });
      
      await tx.wait(); // Attendi la conferma
      
      return {
        txHash: tx.hash,
        feeAmount,
        feeInWei
      };
    } catch (err: any) {
      setError(err.message || "Errore nell'invio della fee");
      return {
        feeAmount: 0,
        feeInWei: "0",
        error: err.message
      };
    } finally {
      setIsCollecting(false);
    }
  }, []);

  /**
   * Invia le fee in token ERC-20
   * @param tokenAddress Indirizzo del token ERC-20
   * @param swapAmount Importo totale dello swap in token
   */
  const sendTokenFee = useCallback(async (tokenAddress: string, swapAmount: number): Promise<EVMFeeResult> => {
    setIsCollecting(true);
    setError(null);
    
    try {
      if (!window.ethereum) throw new Error("Wallet non rilevato. Installa MetaMask!");
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Calcola la fee (0.3% dello swap)
      const feeAmount = swapAmount * FEE_PERCENTAGE;
      
      // ABI minima per ERC-20
      const ERC20_ABI = [
        "function decimals() view returns (uint8)",
        "function transfer(address to, uint amount) returns (bool)"
      ];
      
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
      
      // Recupera i decimali del token
      const decimals = await tokenContract.decimals();
      
      // Calcola l'importo con i decimali corretti
      const feeInUnits = ethers.utils.parseUnits(feeAmount.toString(), decimals);
      
      // Invia la transazione
      const tx = await tokenContract.transfer(FEE_COLLECTOR_ADDRESS, feeInUnits);
      await tx.wait(); // Attendi la conferma
      
      return {
        txHash: tx.hash,
        feeAmount,
        feeInWei: feeInUnits.toString()
      };
    } catch (err: any) {
      setError(err.message || "Errore nell'invio della fee");
      return {
        feeAmount: 0,
        feeInWei: "0",
        error: err.message
      };
    } finally {
      setIsCollecting(false);
    }
  }, []);

  /**
   * Calcola l'importo della fee
   */
  const calculateFee = useCallback((amount: number) => {
    return amount * FEE_PERCENTAGE;
  }, []);

  return {
    sendNativeFee,
    sendTokenFee,
    calculateFee,
    isCollecting,
    error,
    feeCollectorAddress: FEE_COLLECTOR_ADDRESS
  };
}