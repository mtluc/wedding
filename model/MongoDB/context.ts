import {
  BulkWriteOptions,
  ClientSession,
  DeleteOptions,
  Filter,
  FindOptions,
  MongoClient,
  OptionalUnlessRequiredId,
  ServerApiVersion,
  UpdateOptions,
} from "mongodb";

export class DBContext {
  protected client!: MongoClient;
  protected db!: string;

  constructor(uri: string, db: string) {
    this.db = db;
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
      },
    });
  }

  /**
   * Query 1 danh sách
   * @param colection
   * @param filter
   * @param options
   * @returns
   */
  async filter<T extends object>(
    colection: string,
    filter: Filter<T>,
    options?: FindOptions
  ) {
    return (await this.client
      .db(this.db)
      .collection<T>(colection)
      .find(filter, options)
      .toArray()) as T[];
  }

  /**
   * select 1 item
   * @param colection
   * @param filter
   * @param options
   * @returns
   */
  async find<T extends object>(
    colection: string,
    filter: Filter<T>,
    options?: FindOptions
  ) {
    return await this.client
      .db(this.db)
      .collection<T>(colection)
      .findOne(filter, options);
  }

  /**
   * Thêm một bản ghi
   * @param colection
   * @param objs
   */
  async add<T extends object>(
    colection: string,
    objs: T[],
    options?: BulkWriteOptions
  ) {
    return this.client
      .db(this.db)
      .collection<T>(colection)
      .insertMany(objs as any, options);
  }

  /**
   * Cập nhật bản ghi
   * @param colection
   * @param filter
   * @param obj
   * @param options
   */
  async update<T extends Document>(
    colection: string,
    filter: Filter<T>,
    obj: Partial<T>,
    options?: UpdateOptions
  ) {
    return this.client.db(this.db).collection<T>(colection).updateMany(
      filter,
      {
        $set: obj,
      },
      options
    );
  }

  /**
   * Xóa bản ghi
   * @param colection
   * @param filter
   * @param options
   */
  async delete<T extends Document>(
    colection: string,
    filter: Filter<T>,
    options?: DeleteOptions
  ) {
    return this.client
      .db(this.db)
      .collection<T>(colection)
      .deleteMany(filter, options);
  }

  /**
   *
   * @returns Begin Session
   */
  beginSession() {
    return this.client.startSession();
  }

  /**
   * beginTransaction
   * @param session
   */
  beginTransaction(session: ClientSession) {
    session.startTransaction();
  }

  /**
   * commitTransaction
   * @param session
   */
  commitTransaction(session: ClientSession) {
    session.commitTransaction();
  }

  /**
   * rollBackTransaction
   * @param session
   */
  rollBackTransaction(session: ClientSession) {
    session.abortTransaction();
  }
}
