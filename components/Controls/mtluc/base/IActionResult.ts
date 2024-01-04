export interface IActionResult<T> {
    mode: "ADD" | "EDIT" | "DELETE" | "NONE";
    record: T | undefined;
  }