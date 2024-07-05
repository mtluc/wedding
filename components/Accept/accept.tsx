import Modal from "../Controls/mtluc/Modal/modal";
import classNames from "./accept.module.scss";
import IconSvg from "../Controls/mtluc/icon/icon-svg";
import CheckBox from "../Controls/mtluc/Form/Checkbox/checkbox";
import Form from "../Controls/mtluc/Form/form";
import { GuestBook } from "@/model/GuestBook/GuestBook";
import { FormEvent, useState } from "react";
import {
  handlerRequertException,
  pushNotification,
  setAppLoading,
} from "../Controls/mtluc/base/common";
import GuestBookService from "../admin/guest-book/guest-book.service";

const Accept = ({
  onClose,
  guest,
}: {
  onClose: (accept: boolean) => void;
  guest: GuestBook;
}) => {
  const [accept, setAccept] = useState(guest.Agree);
  const onSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      setAppLoading(true);
      const res = await new GuestBookService().accept(guest._id, accept);
      onClose(accept);
      pushNotification({
        type:'success',
        message: 'Đã lưu xác nhận!'
      })
    } catch (error) {
      handlerRequertException(error);
    } finally {
      setAppLoading(false);
    }
  };
  return (
    <Modal
      title="Xác nhận tham dự lễ cưới"
      onClose={() => {
        onClose(guest.Agree);
      }}
    >
      <div className={classNames.wapper}>
        <Form onSubmit={onSubmit}>
          <div className="mtl-control">
            <CheckBox
              name="isAccept"
              value={accept}
              onChange={(e, ctr, v) => {
                setAccept(v ? true : false);
              }}
            />
            <label htmlFor="isAccept">Tôi sẽ tham dự lễ cưới của hai bạn</label>
          </div>

          <div className="mtl-control">
            <div className={classNames.description}>
              Sự có mặt của bạn là niềm vui và niềm vinh hạnh của chúng tôi gia
              đình. Trân trọng!
            </div>
          </div>

          <div className={classNames.toolbars}>
            <button type="submit" className="btn-primary-ltr">
              <IconSvg iconKeys="check" />
              <span>Xác nhận</span>
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};
export default Accept;
