import { NextPage } from "next";
import Layout from "../Components/Share/Layout/layout";
import { clearCache } from "../lib/caching";
import Modal from "../Components/Controls/mtluc/Modal/modal";

export async function getServerSideProps() {
  clearCache();
  return { props: {} };
}
const ClearCache: NextPage = ({ initAppState }: any) => {
  return (
    <Layout
      title="Clear Cache"
      canonical="/clear-cache"
      description="Xóa cache"
      keywords=""
      thumbnailUrl=""
    >
      <div className="container">
        <h1
          style={{
            margin: "30px 0 60px 0",
            textAlign: "center",
          }}
        >
          Clear Cache
        </h1>
      </div>
      <Modal>
        <div>a</div>
      </Modal>
    </Layout>
  );
};
export default ClearCache;
