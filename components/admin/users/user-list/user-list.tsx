import DictBaseEditor from "@/components/Controls/mtluc/DictBase/Editor/dict-base-editor";
import DictBaseListing, {
  IDictBaseListProps,
  IDictBaseListState,
} from "@/components/Controls/mtluc/DictBase/Listing/dict-base-listing";
import { DictBaseService } from "@/components/Controls/mtluc/DictBase/Service/dict-base.service";
import { IColumn } from "@/components/Controls/mtluc/Grid/Column/column";
import { ReactElement } from "react";
import UserService from "../user.service";
import UserEditor from "../user-editor/user-editor";
import classNames from './user-list.module.scss';

interface IUserListProps extends IDictBaseListProps { }

interface IUserListState extends IDictBaseListState { }

class UserList extends DictBaseListing<IUserListProps, IUserListState, UserEditor> {
  override title: string = "Người dùng";
  override showTitle: boolean = false;
  override fieldId: string = "UserName";
  override fieldName: string = "FullName";
  override service: DictBaseService = new UserService();
  override calssWap: string = classNames.wap;

  override initColums(): IColumn[] {
    return [
      {
        Id: "UserName",
        Title: "Tên đăng nhập",
        MinWidth: 150,
        MaxWidth: 250,
      },
      {
        Id: "FullName",
        Title: "Tên người dùng",
        MinWidth: 200,
        Width: 200,
      },
      {
        Id: "Actived",
        Title: "Trạng thái",
        Type: "check",
        MinWidth: 80,
        MaxWidth: 150,
      },
    ];
  }
  override renderDetail(): ReactElement<DictBaseEditor<any, any>> {
    return (
      <UserEditor
        ref={this.detailRef}
        actionResult={this.handlerActionResult.bind(this)}
      />
    );
  }
}
export default UserList;
