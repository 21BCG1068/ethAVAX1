import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('Wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait()
      getBalance();
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Account: {account}</p>
        <p>Balance: {balance}</p>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  

  return (
    <main className="container">
      <header>
        <h1>Greetings from Arsh!</h1>
      </header>
      <div className="user-info">
        {ethWallet ? (
          account ? (
            <>
              <p>Your Account: {account}</p>
              <p>Your Balance: {balance}</p>
              <button onClick={deposit}>Deposit 1 ETH</button>
              <button onClick={withdraw}>Withdraw 1 ETH</button>
            </>
          ) : (
            <button onClick={connectAccount}>Please connect your Metamask wallet</button>
          )
        ) : (
          <p>Please install Metamask in order to use this ATM.</p>
        )}
      </div>
      <style jsx>{`
        .container {
          text-align: center;
          padding: 20px;
        }

        header {
          margin-bottom: 20px;
        }

        .user-info {
          margin-top: 30px;
        }

        .user-info p {
          margin-bottom: 10px;
        }

        .user-info button {
          margin: 5px;
          padding: 10px 20px;
          background-color: #808080;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .user-info button:hover {
          background-color: #90EE90;
        }
      `}
      </style>
    </main>
  );


}






