import { Typography } from "@mui/material";
import BigNumberDisplay from "components/BigNumberDisplay";
import NumberInput from "components/NumberInput";
import { Popup } from "components/Popup";
import TxLoader from "components/TxLoader";
import useNotification from "hooks/useNotification";
import { jettonDeployController } from "lib/deploy-controller";
import { useState } from "react";
import WalletConnection from "services/wallet-connection";
import useJettonStore from "store/jetton-store/useJettonStore";
import { Address, toNano } from "ton";
import { AppButton } from "components/appButton";

function MintJettonsAction() {
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { jettonMaster, isAdmin, symbol, getJettonDetails, isMyWallet } = useJettonStore();
  const { showNotification } = useNotification();

  if (!isAdmin || !isMyWallet) {
    return null;
  }

  const onMint = async () => {
    if (!jettonMaster) {
      return;
    }

    if (!amount || amount === 0) {
      showNotification(`Minimum amount of ${symbol} to mint is 1`, "warning");
      return;
    }
    const value = toNano(amount);

    try {
      setIsLoading(true);
      const connection = WalletConnection.getConnection();
      await jettonDeployController.mint(connection, Address.parse(jettonMaster), value);
      setOpen(false);
      const message = (
        <>
          Successfully minted <BigNumberDisplay value={amount} /> {symbol}
        </>
      );
      getJettonDetails();
      showNotification(message, "success");
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        showNotification(error.message, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onClose = () => {
    setAmount(0);
    setOpen(false);
  };

  return (
    <>
      <TxLoader open={isLoading}>
        <Typography>Minting...</Typography>
      </TxLoader>
      <Popup open={open && !isLoading} onClose={onClose} maxWidth={400}>
        <>
          <Typography className="title">Mint {symbol}</Typography>
          <NumberInput
            label={`Enter ${symbol} amount`}
            value={amount}
            onChange={(value: number) => setAmount(value)}
          />
          <AppButton onClick={onMint}>Submit</AppButton>
        </>
      </Popup>
      <AppButton transparent={true} onClick={() => setOpen(true)}>
        Mint
      </AppButton>
    </>
  );
}

export default MintJettonsAction;
