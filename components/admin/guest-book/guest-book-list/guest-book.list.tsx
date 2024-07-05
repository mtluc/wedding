import DictBaseEditor from "@/components/Controls/mtluc/DictBase/Editor/dict-base-editor";
import DictBaseListing, {
  IDictBaseListProps,
  IDictBaseListState,
} from "@/components/Controls/mtluc/DictBase/Listing/dict-base-listing";
import { DictBaseService } from "@/components/Controls/mtluc/DictBase/Service/dict-base.service";
import { IColumn } from "@/components/Controls/mtluc/Grid/Column/column";
import { IToolbar } from "@/components/Controls/mtluc/base/Itoolbar";
import {
  formatNumber,
  handlerRequertException,
  pushDialog,
  removeVietnameseTones,
} from "@/components/Controls/mtluc/base/common";
import AppContext, { IAppContext } from "@/store/app-context";
import { JSX, MouseEvent, ReactElement } from "react";
import GuestBookEditor from "../guest-book-editor/guest-book.editor";
import GuestBookService from "../guest-book.service";
import classNames from "./guest-book-list.module.scss";
import WeddingService from "../../wedding/wedding.service";
import { Wedding } from "@/model/Wedding/wedding";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

interface IGuestBookListProps extends IDictBaseListProps {}

interface IGuestBookListState extends IDictBaseListState {}

class GuestBookList extends DictBaseListing<
  IGuestBookListProps,
  IGuestBookListState,
  GuestBookEditor
> {
  static contextType = AppContext;

  get ctx() {
    return this.context as IAppContext;
  }

  override title: string = "Khách mời";
  override showTitle: boolean = false;
  override fieldId: string = "_id";
  override fieldName: string = "FullName";
  override service: DictBaseService = new GuestBookService();
  override calssWap: string = classNames.wap;
  override initToolbar(): IToolbar[] {
    return [
      ...super.initToolbar(),
      {
        id: "PHONE",
        text: "Gọi",
        disabled: true,
        class: "btn btn-phone",
        iconKey: "phone",
        responsive: true,
      },
      {
        id: "SHARE",
        text: "Gửi",
        disabled: true,
        class: "btn btn-share",
        iconKey: "share",
        responsive: true,
      },
    ];
  }

  override enableToolBar(currentRow: any) {
    const toolbars = this.state.toolbars;
    toolbars.forEach((button) => {
      switch (button.id) {
        case "VIEW":
        case "EDIT":
        case "DELETE":
        case "DUPLICATE":
        case "PHONE":
        case "SHARE":
          button.disabled = !currentRow;
          break;
      }
    });
    this.setState({ toolbars });
  }

  shareClick = async (row: any) => {
    try {
      if (navigator.share) {
        this.setLoading(false);
        const res = await new WeddingService().getById(
          this.ctx.auth?.user?.UserName
        );

        if ((res?.data as any as Wedding)?.GroomName) {
          navigator
            .share({
              title: [
                `Trân trọng kính mời`,
                row.Relationship,
                row.ShortName,
              ].join(" "),
              text: [
                `Trân trọng kính mời`,
                row.Relationship,
                row.ShortName,
              ].join(" "),
              url: `${
                publicRuntimeConfig.shareHost
              }/thiep-moi/${removeVietnameseTones(
                [row.Relationship, row.ShortName].join(" ")
              )
                .toLowerCase()
                .replace(/ /gi, "-")}/${btoa(
                encodeURIComponent(
                  JSON.stringify({
                    id: row._id,
                    user: this.ctx.auth?.user?.UserName,
                  })
                )
              )}`,
            })
            .then(() => {
              console.log("Gửi thành công!");
            })
            .catch((error) => {
              console.log("Error sharing", error);
            });
        } else {
          pushDialog({
            title: "Thông báo",
            type: "question",
            content:
              "Bạn chưa câp nhật thông tin lễ cưới. Cập nhật ngay để gửi thiệp mời?",
          }).then((x) => {
            if (x == "accept") {
              location.href = "/admin/thong-tin-le-cuoi";
            }
          });
        }
      } else {
        console.log("Share not supported on this browser, do it the old way.");
      }
    } catch (error) {
      handlerRequertException(error);
    } finally {
      this.setLoading(false);
    }
  };

  override async handlerToolBarClick(e: MouseEvent, btn: IToolbar) {
    try {
      switch (btn.id) {
        case "PHONE":
          if (this.state.rowSelected && this.state.rowSelected.row.Phone) {
            let aTag: HTMLLinkElement | undefined = document.createElement(
              "a"
            ) as any as HTMLLinkElement;
            aTag.href = `tel:${this.state.rowSelected.row.Phone}`;
            aTag.click();
            aTag = undefined;
          }
          break;
        case "SHARE":
          if (this.state.rowSelected && this.state.rowSelected.row) {
            this.shareClick(this.state.rowSelected.row);
          }
          break;
        default:
          await super.handlerToolBarClick(e, btn);
          break;
      }
    } catch (error) {
      handlerRequertException(error);
    }
  }

  override initColums(): IColumn[] {
    return [
      {
        Id: "Relationship",
        Title: "Quan hệ",
        MinWidth: 100,
        MaxWidth: 100,
      },
      {
        Id: "ShortName",
        Title: "Tên",
        MinWidth: 100,
      },
      {
        Id: "FullName",
        Title: "Họ tên",
        MinWidth: 200,
      },
      {
        Id: "Phone",
        Title: "Số điện thoại",
        MinWidth: 100,
        Type: "phone",
      },
      {
        Id: "GuestDate",
        Title: "Thời gian mời",
        Type: "date",
        Format: "HH:MM - dd/mm/yyyy",
        MinWidth: 150,
      },
      {
        Id: "Description",
        Title: "Ghi chú",
        MinWidth: 300,
      },
      {
        Id: "Amount",
        Title: "Tiền",
        MinWidth: 200,
        Type: "number",
        Format: 0,
      },
      {
        Id: "IsConfirm",
        Title: "Hỏi tham dự",
        Type: "check",
        MinWidth: 100,
        MaxWidth: 100,
      },
      {
        Id: "IsConfirmBus",
        Title: "Hỏi chọn xe",
        Type: "check",
        MinWidth: 100,
        MaxWidth: 100,
      },
      {
        Id: "Agree",
        Title: "Tham dự",
        Type: "check",
        MinWidth: 80,
        MaxWidth: 100,
      },
      {
        Id: "BusId",
        Title: "Tuyến xe",
        Type: "combobox",
        MinWidth: 200,
        DataSource: [],
        FieldId: "BusId",
        FieldName: "BusName",
      },
      {
        Id: "Sent",
        Title: "Đã mời",
        Type: "check",
        MinWidth: 80,
        MaxWidth: 100,
      },
    ];
  }
  override renderDetail(): ReactElement<DictBaseEditor<any, any>> {
    return (
      <GuestBookEditor
        ref={this.detailRef}
        actionResult={this.handlerActionResult.bind(this)}
      />
    );
  }
  override renderOtherHeader(): JSX.Element {
    let amount = 0;
    this.state?.datas?.forEach((x) => {
      if (x.Amount) {
        amount += x.Amount;
      }
    });
    return (
      <div className={classNames.total_amount}>
        Tiền mừng: <strong>{formatNumber(amount, 0)}đ</strong>
      </div>
    );
  }
}
export default GuestBookList;
