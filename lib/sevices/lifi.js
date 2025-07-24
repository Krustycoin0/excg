import { LiFi } from '@lifi/sdk';

// Configurazione corretta di Li.Fi
const lifiConfig = {
  integrator: 'KrustyCoin-Exchange',
  apiUrl: 'https://li.quest/v1/',
  defaultRouteOptions: {
    slippage: 0.005, // 0.5%
    order: 'RECOMMENDED',
    allowSwitchChain: true,
  }
};

export const lifi = new LiFi(lifiConfig);

// Funzione corretta per trovare route
export async function getRoute(fromChain, toChain, fromToken, toToken, fromAmount, fromAddress) {
  try {
    const routeRequest = {
      fromChainId: fromChain,
      toChainId: toChain,
      fromTokenAddress: fromToken,
      toTokenAddress: toToken,
      fromAddress: fromAddress,
      fromAmount: fromAmount,
      options: lifiConfig.defaultRouteOptions
    };

    console.log('Route request:', routeRequest);
    const route = await lifi.getRoutes(routeRequest);
    return route;
  } catch (error) {
    console.error('Error getting route:', error);
    throw new Error(`Failed to get route: ${error.message}`);
  }
}

// Funzione corretta per eseguire lo swap
export async function executeRoute(route, signer) {
  try {
    const execution = await lifi.executeRoute(signer, route);
    return execution;
  } catch (error) {
    console.error('Error executing route:', error);
    throw new Error(`Failed to execute swap: ${error.message}`);
  }
}