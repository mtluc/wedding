import ComboBox from "@/components/Controls/mtluc/Form/Combobox/combobox";
import DatePicker from "@/components/Controls/mtluc/Form/Date/DatePicker/datepicker";
import Numeric from "@/components/Controls/mtluc/Form/Numeric/numeric";
import TextArea from "@/components/Controls/mtluc/Form/TextArea/textarea";
import TextBox from "@/components/Controls/mtluc/Form/Textbox/textbox";
import Form from "@/components/Controls/mtluc/Form/form";
import { IFormContext } from "@/components/Controls/mtluc/Form/form-context";
import {
  buildClass,
  handlerRequertException,
  parseDate,
  pushNotification,
  setAppLoading,
} from "@/components/Controls/mtluc/base/common";
import IconSvg from "@/components/Controls/mtluc/icon/icon-svg";
import Invitation from "@/components/invitation/invitation";
import { banks } from "@/model/Bank/bank";
import { Wedding as IWedding } from "@/model/Wedding/wedding";
import { FormEvent, useEffect, useState } from "react";
import classNames from "./wedding.module.scss";
import WeddingService from "./wedding.service";
const Wedding = () => {
  const [data, setData] = useState({} as IWedding);

  const loadData = async () => {
    try {
      setAppLoading(true);
      const resĐata = (await new WeddingService().getByIdOrDefault())
        ?.data as any as IWedding;
      if (resĐata) {
        setData({
          ...resĐata,
          PartyDate: parseDate(resĐata.PartyDate),
          WeddingDate: parseDate(resĐata.WeddingDate),
        });
      }
    } catch (error) {
      handlerRequertException(error);
    } finally {
      setAppLoading(false);
    }
  };

  const onSubmit = async (e: FormEvent, v: IWedding, form: IFormContext) => {
    try {
      e.preventDefault();
      setAppLoading(true);
      const res = await new WeddingService().updateItem(data);
      pushNotification({
        message: "Lưu thành công!",
        type: "success",
      });
    } catch (error) {
      handlerRequertException(error);
    } finally {
      setAppLoading(false);
    }
  };

  const setDate = (
    field: string,
    hours: number,
    minute: number,
    date: Date
  ) => {
    date.setHours(hours);
    date.setMinutes(minute);
    setData({
      ...data,
      [field]: date,
    });
  };

  useEffect(() => {
    if (!data.PartyDate) {
      loadData();
    }
  }, [data]);

  return (
    <div className={classNames.wap}>
      <div className={classNames.from}>
        <Form class={classNames.form} onSubmit={onSubmit}>
          <div className={buildClass(["custom-scroll", classNames.controls])}>
            <div className={classNames.controls_wap}>
              <div className="row">
                <div className="mtl-control col-12 col-sm-6">
                  <label
                    className={buildClass([classNames.label, "mtl-lable"])}
                    htmlFor="IsGroom"
                  >
                    Thiệp của<span>*</span>
                  </label>
                  <div className="flex-1">
                    <ComboBox
                      className="col-12"
                      name="IsGroom"
                      dataSource={[
                        {
                          id: true,
                          name: "Nhà trai",
                        },
                        {
                          id: false,
                          name: "Nhà gái",
                        },
                      ]}
                      fieldId="id"
                      fieldName="name"
                      value={data.IsGroom}
                      onChange={(e, ctr, v) => {
                        setData({ ...data, [ctr.name]: v });
                      }}
                      required
                    />
                  </div>
                </div>
                <div className="mtl-control col-12 col-sm-6">
                  <label
                    className={buildClass([classNames.label, "mtl-lable"])}
                    htmlFor="Phone"
                  >
                    Số điện thoại<span>*</span>
                  </label>
                  <div className="flex-1">
                    <TextBox
                      className="col-12"
                      name="Phone"
                      phone
                      required
                      placeholder="Số điện thoại"
                      value={data.Phone}
                      onChange={(e, ctr, v) => {
                        setData({ ...data, [ctr.name]: v });
                      }}
                    />
                  </div>
                </div>

                <div className="mtl-control col-12 col-sm-6">
                  <label
                    className={buildClass([classNames.label, "mtl-lable"])}
                    htmlFor="BankId"
                  >
                    Ngân hàng
                  </label>
                  <div className="flex-1">
                    <ComboBox
                      className="col-12"
                      name="BankId"
                      dataSource={banks}
                      fieldId="id"
                      fieldName="name"
                      placeholder="Chọn ngân hàng"
                      value={data.BankId}
                      onChange={(e, ctr, v) => {
                        setData({ ...data, [ctr.name]: v });
                      }}
                    />
                  </div>
                </div>

                <div className="mtl-control col-12 col-sm-6">
                  <label
                    className={buildClass([classNames.label, "mtl-lable"])}
                    htmlFor="BankAccountNo"
                  >
                    Số tài khoản
                  </label>
                  <div className="flex-1">
                    <TextBox
                      className="col-12"
                      name="BankAccountNo"
                      placeholder="Số tài khoản"
                      value={data.BankAccountNo}
                      onChange={(e, ctr, v) => {
                        setData({ ...data, [ctr.name]: v });
                      }}
                    />
                  </div>
                </div>

                <div className="mtl-control col-12">
                  <label
                    className={buildClass([classNames.label, "mtl-lable"])}
                    htmlFor="GoogleMapLink"
                  >
                    Link GoogleMap
                  </label>
                  <div className="flex-1">
                    <TextArea
                      className="col-12"
                      name="GoogleMapLink"
                      placeholder="Link GoogleMap"
                      rows={1}
                      value={data.GoogleMapLink}
                      onChange={(e, ctr, v) => {
                        setData({ ...data, [ctr.name]: v });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-6">
                  <fieldset>
                    <legend>Bữa cơm thân mật</legend>
                    <div className="row">
                      <div className="mtl-control col-6 col-md-12">
                        <label
                          className={buildClass([
                            classNames.label,
                            "mtl-lable",
                          ])}
                          htmlFor="PartyHours"
                        >
                          Giờ mời<span>*</span>
                        </label>
                        <div
                          className={buildClass(["flex-1", classNames.time])}
                        >
                          <Numeric
                            name="PartyHours"
                            className="flex-1"
                            creaseButton="none"
                            format="0"
                            min={0}
                            max={23}
                            value={data.PartyDate?.getHours() || 0}
                            onChange={(e, ctr, v) => {
                              if (data.PartyDate) {
                                setDate(
                                  "PartyDate",
                                  v || 0,
                                  data.PartyDate.getMinutes(),
                                  data.PartyDate
                                );
                              }
                            }}
                            required
                          />
                          <span>/</span>
                          <Numeric
                            name="PartyMinute"
                            className="flex-1"
                            format="0"
                            creaseButton="none"
                            min={0}
                            max={59}
                            value={data.PartyDate?.getMinutes() || 0}
                            onChange={(e, ctr, v) => {
                              if (data.PartyDate) {
                                setDate(
                                  "PartyDate",
                                  data.PartyDate.getHours(),
                                  v || 0,
                                  data.PartyDate
                                );
                              }
                            }}
                            required
                          />
                        </div>
                      </div>
                      <div className="mtl-control col-6 -col-md-12">
                        <label
                          className={buildClass([
                            classNames.label,
                            "mtl-lable",
                          ])}
                          htmlFor="PartyDate"
                        >
                          Ngày mời<span>*</span>
                        </label>
                        <div className="flex-1">
                          <DatePicker
                            name="PartyDate"
                            className="col-12"
                            required
                            value={data.PartyDate}
                            onChange={(e, ctr, v) => {
                              if (v) {
                                setDate(
                                  "PartyDate",
                                  data.PartyDate.getHours(),
                                  data.PartyDate.getMinutes(),
                                  v
                                );
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="mtl-control col-12">
                        <label
                          className={buildClass([
                            classNames.label,
                            "mtl-lable",
                          ])}
                          htmlFor="PartyConvertDay"
                        >
                          Âm lịch<span>*</span>
                        </label>
                        <div className="flex-1">
                          <TextBox
                            name="PartyConvertDay"
                            className="col-12"
                            required
                            placeholder="ngày 10 tháng 12 năm Quý Mão"
                            value={data.PartyConvertDay}
                            onChange={(e, ctr, v) => {
                              setData({ ...data, [ctr.name]: v });
                            }}
                          />
                        </div>
                      </div>

                      <div className="mtl-control col-12">
                        <label
                          className={buildClass([
                            classNames.label,
                            "mtl-lable",
                          ])}
                          htmlFor="PartyAt"
                        >
                          Tại<span>*</span>
                        </label>
                        <div className="flex-1">
                          <TextBox
                            name="PartyAt"
                            className="col-12"
                            required
                            placeholder="Tại"
                            value={data.PartyAt}
                            onChange={(e, ctr, v) => {
                              setData({ ...data, [ctr.name]: v });
                            }}
                          />
                        </div>
                      </div>
                      <div className="mtl-control col-12">
                        <label
                          className={buildClass([
                            classNames.label,
                            "mtl-lable",
                          ])}
                          htmlFor="ParttyAddress"
                        >
                          Địa chỉ<span>*</span>
                        </label>
                        <div className="flex-1">
                          <TextArea
                            name="ParttyAddress"
                            className="col-12"
                            required
                            placeholder="Địa chỉ"
                            value={data.ParttyAddress}
                            onChange={(e, ctr, v) => {
                              setData({ ...data, [ctr.name]: v });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>

                <div className="col-12 col-md-6">
                  <fieldset>
                    <legend>Lễ cưới</legend>
                    <div className="row">
                      <div className="mtl-control col-6 col-md-12">
                        <label
                          className={buildClass([
                            classNames.label,
                            "mtl-lable",
                          ])}
                          htmlFor="WeddingHours"
                        >
                          Giờ mời<span>*</span>
                        </label>
                        <div
                          className={buildClass(["flex-1", classNames.time])}
                        >
                          <Numeric
                            name="WeddingHours"
                            className="flex-1"
                            creaseButton="none"
                            format="0"
                            min={0}
                            max={23}
                            required
                            value={data.WeddingDate?.getHours() || 0}
                            onChange={(e, ctr, v) => {
                              if (data.WeddingDate) {
                                setDate(
                                  "WeddingDate",
                                  v || 0,
                                  data.WeddingDate.getMinutes(),
                                  data.WeddingDate
                                );
                              }
                            }}
                          />
                          <span>/</span>
                          <Numeric
                            name="WeddingMinute"
                            className="flex-1"
                            format="0"
                            creaseButton="none"
                            min={0}
                            max={59}
                            required
                            value={data.WeddingDate?.getHours() || 0}
                            onChange={(e, ctr, v) => {
                              if (data.WeddingDate) {
                                setDate(
                                  "WeddingDate",
                                  data.WeddingDate.getHours(),
                                  v || 0,
                                  data.WeddingDate
                                );
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="mtl-control col-6-col-md-12">
                        <label
                          className={buildClass([
                            classNames.label,
                            "mtl-lable",
                          ])}
                          htmlFor="WeddingDate"
                        >
                          Ngày mời<span>*</span>
                        </label>
                        <div className="flex-1">
                          <DatePicker
                            name="WeddingDate"
                            className="col-12"
                            required
                            value={data.WeddingDate}
                            onChange={(e, ctr, v) => {
                              if (v) {
                                setDate(
                                  "WeddingDate",
                                  data.WeddingDate.getHours(),
                                  data.WeddingDate.getMinutes(),
                                  v
                                );
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="mtl-control col-12">
                        <label
                          className={buildClass([
                            classNames.label,
                            "mtl-lable",
                          ])}
                          htmlFor="WeddingConvertDay"
                        >
                          Âm lịch<span>*</span>
                        </label>
                        <div className="flex-1">
                          <TextBox
                            name="WeddingConvertDay"
                            className="col-12"
                            required
                            placeholder="ngày 11 tháng 12 năm Quý Mão"
                            value={data.WeddingConvertDay}
                            onChange={(e, ctr, v) => {
                              setData({ ...data, [ctr.name]: v });
                            }}
                          />
                        </div>
                      </div>

                      <div className="mtl-control col-12">
                        <label
                          className={buildClass([
                            classNames.label,
                            "mtl-lable",
                          ])}
                          htmlFor="WeddingAt"
                        >
                          Tại<span>*</span>
                        </label>
                        <div className="flex-1">
                          <TextBox
                            name="WeddingAt"
                            className="col-12"
                            required
                            placeholder="Tại"
                            value={data.WeddingAt}
                            onChange={(e, ctr, v) => {
                              setData({ ...data, [ctr.name]: v });
                            }}
                          />
                        </div>
                      </div>
                      <div className="mtl-control col-12">
                        <label
                          className={buildClass([
                            classNames.label,
                            "mtl-lable",
                          ])}
                          htmlFor="WeddingAddress"
                        >
                          Địa chỉ<span>*</span>
                        </label>
                        <div className="flex-1">
                          <TextArea
                            name="WeddingAddress"
                            className="col-12"
                            required
                            placeholder="Địa chỉ"
                            value={data.WeddingAddress}
                            onChange={(e, ctr, v) => {
                              setData({ ...data, [ctr.name]: v });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-md-6">
                  <fieldset>
                    <legend>Thông tin nhà trai</legend>
                    <div className="mtl-control">
                      <label
                        className={buildClass([classNames.label, "mtl-lable"])}
                        htmlFor="GroomName"
                      >
                        Chú rể<span>*</span>
                      </label>
                      <div className="flex-1">
                        <TextBox
                          className="col-12"
                          name="GroomName"
                          required
                          placeholder="Tên chú rể"
                          value={data.GroomName}
                          onChange={(e, ctr, v) => {
                            setData({ ...data, [ctr.name]: v });
                          }}
                        />
                      </div>
                    </div>

                    <div className="mtl-control">
                      <label
                        className={buildClass([classNames.label, "mtl-lable"])}
                        htmlFor="GroomFullName"
                      >
                        Họ tên chú rể<span>*</span>
                      </label>
                      <div className="flex-1">
                        <TextBox
                          className="col-12"
                          name="GroomFullName"
                          required
                          placeholder="Họ tên chú rể"
                          value={data.GroomFullName}
                          onChange={(e, ctr, v) => {
                            setData({ ...data, [ctr.name]: v });
                          }}
                        />
                      </div>
                    </div>

                    <div className="mtl-control">
                      <label
                        className={buildClass([classNames.label, "mtl-lable"])}
                        htmlFor="GroomFather"
                      >
                        Tên bố<span>*</span>
                      </label>
                      <div className="flex-1">
                        <TextBox
                          className="col-12"
                          name="GroomFather"
                          required
                          placeholder="Tên bố"
                          value={data.GroomFather}
                          onChange={(e, ctr, v) => {
                            setData({ ...data, [ctr.name]: v });
                          }}
                        />
                      </div>
                    </div>
                    <div className="mtl-control">
                      <label
                        className={buildClass([classNames.label, "mtl-lable"])}
                        htmlFor="GroomMother"
                      >
                        Tên mẹ<span>*</span>
                      </label>
                      <div className="flex-1">
                        <TextBox
                          className="col-12"
                          name="GroomMother"
                          required
                          placeholder="Tên mẹ"
                          value={data.GroomMother}
                          onChange={(e, ctr, v) => {
                            setData({ ...data, [ctr.name]: v });
                          }}
                        />
                      </div>
                    </div>

                    <div className="mtl-control">
                      <label
                        className={buildClass([classNames.label, "mtl-lable"])}
                        htmlFor="GroomAddress"
                      >
                        Địa chỉ<span>*</span>
                      </label>
                      <div className="flex-1">
                        <TextArea
                          className="col-12"
                          name="GroomAddress"
                          required
                          placeholder="Địa chỉ"
                          value={data.GroomAddress}
                          onChange={(e, ctr, v) => {
                            setData({ ...data, [ctr.name]: v });
                          }}
                        />
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="col-12 col-md-6">
                  <fieldset>
                    <legend>Thông tin nhà gái</legend>
                    <div className="mtl-control">
                      <label
                        className={buildClass([classNames.label, "mtl-lable"])}
                        htmlFor="BrideName"
                      >
                        Cô dâu<span>*</span>
                      </label>
                      <div className="flex-1">
                        <TextBox
                          className="col-12"
                          name="BrideName"
                          required
                          placeholder="Tên cô dâu"
                          value={data.BrideName}
                          onChange={(e, ctr, v) => {
                            setData({ ...data, [ctr.name]: v });
                          }}
                        />
                      </div>
                    </div>

                    <div className="mtl-control">
                      <label
                        className={buildClass([classNames.label, "mtl-lable"])}
                        htmlFor="BrideFullName"
                      >
                        Họ tên cô dâu<span>*</span>
                      </label>
                      <div className="flex-1">
                        <TextBox
                          className="col-12"
                          name="BrideFullName"
                          required
                          placeholder="Họ tên cô dâu"
                          value={data.BrideFullName}
                          onChange={(e, ctr, v) => {
                            setData({ ...data, [ctr.name]: v });
                          }}
                        />
                      </div>
                    </div>

                    <div className="mtl-control">
                      <label
                        className={buildClass([classNames.label, "mtl-lable"])}
                        htmlFor="BrideFather"
                      >
                        Tên bố<span>*</span>
                      </label>
                      <div className="flex-1">
                        <TextBox
                          className="col-12"
                          name="BrideFather"
                          required
                          placeholder="Tên bố"
                          value={data.BrideFather}
                          onChange={(e, ctr, v) => {
                            setData({ ...data, [ctr.name]: v });
                          }}
                        />
                      </div>
                    </div>
                    <div className="mtl-control">
                      <label
                        className={buildClass([classNames.label, "mtl-lable"])}
                        htmlFor="BrideMother"
                      >
                        Tên mẹ<span>*</span>
                      </label>
                      <div className="flex-1">
                        <TextBox
                          className="col-12"
                          name="BrideMother"
                          required
                          placeholder="Tên mẹ"
                          value={data.BrideMother}
                          onChange={(e, ctr, v) => {
                            setData({ ...data, [ctr.name]: v });
                          }}
                        />
                      </div>
                    </div>

                    <div className="mtl-control">
                      <label
                        className={buildClass([classNames.label, "mtl-lable"])}
                        htmlFor="BrideAddress"
                      >
                        Địa chỉ<span>*</span>
                      </label>
                      <div className="flex-1">
                        <TextArea
                          className="col-12"
                          name="BrideAddress"
                          required
                          placeholder="Địa chỉ"
                          value={data.BrideAddress}
                          onChange={(e, ctr, v) => {
                            setData({ ...data, [ctr.name]: v });
                          }}
                        />
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          </div>

          <div className={classNames.tool_bar}>
            <button className="btn-primary-ltr" type="submit">
              <IconSvg iconKeys="save" />
              <span>Lưu</span>
            </button>
            {/* <button type="button">
              <IconSvg iconKeys="view" />
              <span>Xem trước</span>
            </button> */}
          </div>
        </Form>
      </div>
      {/* <div className={buildClass(["custom-scroll", classNames.preview])}>
        <Invitation
          className={classNames.invitation}
          wedding={data}
          isPreview
        />
      </div> */}
    </div>
  );
};
export default Wedding;
