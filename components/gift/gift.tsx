/* eslint-disable @next/next/no-img-element */
import { banks } from "@/model/Bank/bank";
import Modal from "../Controls/mtluc/Modal/modal";
import classNames from "./gift.module.scss";
import IconSvg from "../Controls/mtluc/icon/icon-svg";

const Gift = ({
  onClose,
  bank,
}: {
  onClose: () => void;
  bank: {
    bankId: string;
    bankAccount: string;
  };
}) => {
  return (
    <Modal title="Gửi quà tặng" onClose={onClose}>
      <div className={classNames.wapper}>
        <div className={classNames.bank_qr_code}>
          <img
            src={`https://img.vietqr.io/image/${bank.bankId}-${bank.bankAccount}-compact.png`}
            alt="QR code"
          />
        </div>
        <div className={classNames.account_info}>
          <div className={classNames.bank_account_no}>
            Số tài khoản: <strong>{bank.bankAccount}</strong>
            <button
              type="button"
              className={classNames.btn_copy_account}
              onClick={() => {
                navigator.clipboard.writeText(bank.bankAccount);
              }}
              title="Sao chép"
            >
              <IconSvg iconKeys="duplicate" />
            </button>
          </div>
          <div className={classNames.bank_name}>
            Ngân hàng:{""}
            <strong>{banks.find((x) => x.id == bank.bankId)?.name}</strong>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Gift;
