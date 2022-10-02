import getWeb3 from "../getWeb3";
import Election from "../build/Election.json";





export async function Init() {
       

  let accounts,contract;

    
        try {
            const web3 = await getWeb3();
             accounts = await web3.eth.getAccounts();
            console.log(accounts);
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Election.networks[networkId];
            const instance = new web3.eth.Contract(
              Election.abi,
              deployedNetwork && deployedNetwork.address,
            );

            contract = instance;

           return {accounts,contract};
           
          } 
          catch (error) {
            alert(
              `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
          }

    
   
}

