export interface INotification {
  title?: string;
  type: "noti" | "error" | "question";
  content: any;
  preventAction?: (type: "close" | "accept" | "cancel") => void;
}

interface globalApp {
  pushDialog: (noti: INotification) => void;
}

export declare global {
  var [app]: globalApp;
}
