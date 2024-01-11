import { Wedding } from "@/model/Wedding/wedding";
import {
  buildClass,
  formatDate,
  getDisplayDayOfWeek,
} from "../Controls/mtluc/base/common";
import IconSvg from "../Controls/mtluc/icon/icon-svg";
import classNames from "./invitation.module.scss";
import { GuestBook } from "@/model/GuestBook/GuestBook";
import Snowfall from "react-snowfall";
import { useEffect, useState } from "react";
import Gift from "../gift/gift";
import Accept from "../Accept/accept";

const Invitation = ({
  className,
  isPreview,
  wedding,
  guest: _guest,
}: {
  className?: any;
  isPreview?: boolean;
  wedding: Wedding;
  guest: GuestBook;
}) => {
  const [guest, setGuest] = useState(_guest);
  const [image, setImage] = useState(undefined as any as HTMLImageElement);
  useEffect(() => {
    if (!image) {
      const snowflake1 = document.createElement("img");
      snowflake1.src = "/images/icon/heart.png";
      setImage(snowflake1);
    }
  }, [image]);

  const [isOpen, setOpen] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [showAccept, setShowAccept] = useState(false);

  return (
    <>
      <div
        className={buildClass([
          classNames.wap,
          className,
          isOpen ? classNames.open : "",
        ])}
      >
        <div className={classNames.container}>
          <div className={classNames.main}>
            <div className={buildClass([classNames.page, classNames.page1])}>
              <div className={buildClass([classNames.box_2, classNames.front])}>
                <div className={classNames.main_box}>
                  <div className={classNames.name1}>
                    {wedding.IsGroom ? wedding.GroomName : wedding.BrideName}
                  </div>
                  <div className={classNames.and}>Và</div>
                  <div className={classNames.name2}>
                    {wedding.IsGroom ? wedding.BrideName : wedding.GroomName}
                  </div>
                </div>
              </div>

              <div
                className={buildClass([classNames.box_1, classNames.back])}
                hidden={isPreview}
              >
                <div className={classNames.main_box}>
                  <div className={classNames.heading}>Thiệp mời</div>
                  <div className={classNames.title}>Save the date</div>
                  <div className={classNames.date}>
                    {formatDate(wedding.WeddingDate, "dd . mm . yyyy")}
                  </div>
                </div>
              </div>
            </div>
            <div className={classNames.page}>
              <div className={buildClass([classNames.box_3, classNames.front])}>
                <div className={classNames.main_box}>
                  <div className={classNames.content}>
                    <div className={classNames.lable1}>Trân trọng kính mời</div>
                    <div className={classNames.customer_name}>
                      {guest.Relationship}
                    </div>
                    <div className={classNames.lable2}>
                      Tới dự bữa cơm thân mật chung vui cùng gia đình chúng tôi
                    </div>
                    <div className={classNames.user_main}>
                      <span className={classNames.name}>
                        {wedding.IsGroom
                          ? wedding.GroomFullName
                          : wedding.BrideFullName}
                      </span>
                      <span className={classNames.and}>
                        {" "}
                        <IconSvg iconKeys="heart-double" />{" "}
                      </span>
                      <span className={classNames.name2}>
                        {wedding.IsGroom
                          ? wedding.BrideFullName
                          : wedding.GroomFullName}
                      </span>
                    </div>
                    <div className={classNames.title_at_time}>
                      Được tổ chức vào lúc
                    </div>
                    <div className={classNames.at_time}>
                      ~ {formatDate(guest.GuestDate, "HH")} giờ{" "}
                      {formatDate(guest.GuestDate, "MM")} ~
                    </div>
                    <div className={classNames.date}>
                      <span className={classNames.day_of_week}>
                        {getDisplayDayOfWeek(guest.GuestDate)}
                      </span>
                      <span className={classNames.day}>
                        {formatDate(guest.GuestDate, "dd")}
                      </span>
                      <span className={classNames.month_year}>
                        {formatDate(guest.GuestDate, "mm-yyyy")}
                      </span>
                    </div>
                    <div className={classNames.lunar_calendar}>
                      Tức {guest.ConvertDay}
                    </div>
                    <div className={classNames.address}>
                      <div className={classNames.at}>
                        Tại: {wedding.PartyAt}
                      </div>
                      <div className={classNames.detail}>
                        {wedding.ParttyAddress}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={buildClass([classNames.page, classNames.page3])}>
              <div className={buildClass([classNames.box_4, classNames.front])}>
                <div className={classNames.main_box}>
                  <div className={classNames.title}>
                    {wedding.IsGroom ? "Lễ Thành Hôn" : "Lễ Vu Quy"}{" "}
                  </div>
                  <div className={classNames.at_time}>
                    Được tổ chức vào lúc {formatDate(wedding.WeddingDate, "HH")}{" "}
                    giờ {formatDate(wedding.WeddingDate, "MM")}
                  </div>
                  <div className={classNames.day_of_week}>
                    ~ {getDisplayDayOfWeek(wedding.WeddingDate)} ~
                  </div>
                  <div className={classNames.date}>
                    {formatDate(wedding.WeddingDate, "dd.mm.yyyy")}
                  </div>
                  <div className={classNames.lunar_calendar}>
                    Tức {wedding.WeddingConvertDay}
                  </div>
                  <div className={classNames.address}>
                    <div className={classNames.at}>
                      Tại: {wedding.WeddingAt}
                    </div>
                    <div className={classNames.detail}>
                      {wedding.WeddingAddress}
                    </div>
                  </div>
                  <div className={classNames.thanks}>
                    Rất hân hạnh được đón tiếp!
                  </div>
                  <div className={classNames.flex}>
                    <div className={classNames.group}>
                      <div className={classNames.group_title}>
                        {wedding.IsGroom ? "Nhà trai" : "Nhà Gái"}
                      </div>
                      <div className={classNames.father}>
                        {wedding.IsGroom
                          ? wedding.GroomFather
                          : wedding.BrideFather}
                      </div>
                      <div className={classNames.mother}>
                        {wedding.IsGroom
                          ? wedding.GroomMother
                          : wedding.BrideMother}
                      </div>
                      <div className={classNames.child}>
                        {wedding.IsGroom ? "Chú rể" : "Cô dâu"}:{" "}
                        {wedding.IsGroom
                          ? wedding.GroomFullName
                          : wedding.BrideFullName}
                      </div>
                    </div>
                    <div className={classNames.flex_1}></div>
                    <div className={classNames.group}>
                      <div className={classNames.group_title}>
                        {!wedding.IsGroom ? "Nhà trai" : "Nhà Gái"}
                      </div>
                      <div className={classNames.father}>
                        {!wedding.IsGroom
                          ? wedding.GroomFather
                          : wedding.BrideFather}
                      </div>
                      <div className={classNames.mother}>
                        {!wedding.IsGroom
                          ? wedding.GroomMother
                          : wedding.BrideMother}
                      </div>
                      <div className={classNames.child}>
                        {!wedding.IsGroom ? "Chú rể" : "Cô dâu"}:{" "}
                        {!wedding.IsGroom
                          ? wedding.GroomFullName
                          : wedding.BrideFullName}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={buildClass([classNames.box_5, classNames.back])}
                hidden={isPreview}
              >
                <div className={classNames.main_box}>
                  <div className={classNames.title}>Trân trọng kính mời</div>
                  <div className={classNames.customer_name}>
                    {guest.Relationship} {guest.ShortName}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {image && isOpen ? (
        <Snowfall
          style={{
            zIndex: 1000,
            position: "fixed",
          }}
          snowflakeCount={7}
          rotationSpeed={[0, 0]}
          radius={[8, 26]}
          images={[image]}
        />
      ) : null}

      {
        <>
          <div
            className={classNames.open_wap}
            hidden={isOpen}
            onClick={() => {
              setOpen(!isOpen);
              setTimeout(() => {
                setShowButtons(true);
              }, 2000);
            }}
          >
            <button className="btn-primary-ltr">Click để mở thiệp</button>
          </div>
        </>
      }

      {showButtons ? (
        <div className={classNames.toolbars}>
          {wedding.Phone ? (
            <a className="btn" title="Gọi" href={`tel:${wedding.Phone}`}>
              <IconSvg iconKeys="phone" />
            </a>
          ) : null}

          {wedding.GoogleMapLink ? (
            <a
              className="btn"
              title="GooleMap"
              href={wedding.GoogleMapLink}
              target="_blank"
            >
              <IconSvg iconKeys="google-map" />
            </a>
          ) : null}

          {wedding.BankId && wedding.BankAccountNo ? (
            <a
              className="btn"
              title="Hộp quà cưới"
              onClick={(e) => {
                e.preventDefault();
                setShowGift(true);
              }}
            >
              <IconSvg iconKeys="gift-heart" />
            </a>
          ) : null}
        </div>
      ) : null}

      {showButtons ? (
        <button
          className={buildClass(["btn-primary-ltr", classNames.accept])}
          type="button"
          onClick={(e) => {
            setShowAccept(true);
          }}
        >
          <IconSvg iconKeys="check" />
          <span>Xác nhận tham dự</span>
        </button>
      ) : null}

      {showGift ? (
        <Gift
          bank={{
            bankId: wedding.BankId,
            bankAccount: wedding.BankAccountNo,
          }}
          onClose={() => {
            setShowGift(false);
          }}
        />
      ) : null}

      {showAccept ? (
        <Accept
          guest={guest}
          onClose={(accept) => {
            setGuest({ ...guest, Agree: accept });
            setShowAccept(false);
          }}
        />
      ) : null}
    </>
  );
};
Invitation.defaultProps = {
  wedding: new Wedding(),
  guest: new GuestBook(),
};
export default Invitation;
