import Navbar from "../components/Navbar";
import { Card } from "../components";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { useGlobalContext } from "../ThemeContext";

const Home = () => {
  const {
    products,
    isProductLoading,
    page,
    setSearchQuery,
    handleNext,
    handlePrev,
    setPage,
  } = useGlobalContext();

  //Modal [optional]
  return (
    <>
      <Navbar />
      {isProductLoading && (
        <>
          <div className="flex flex-col items-center justify-center mt-10">
            <div className="flex">
              <Skeleton
                height={180}
                width={320}
                containerClassName="mx-10 my-4"
              />
              <Skeleton
                height={180}
                width={320}
                containerClassName="mx-10 my-4"
              />
              <Skeleton
                height={180}
                width={320}
                containerClassName="mx-10 my-4"
              />
            </div>
            <div className="flex">
              <Skeleton
                height={180}
                width={320}
                containerClassName="mx-10 my-4"
              />
              <Skeleton
                height={180}
                width={320}
                containerClassName="mx-10 my-4"
              />
              <Skeleton
                height={180}
                width={320}
                containerClassName="mx-10 my-4"
              />
            </div>
            <div className="flex">
              <Skeleton
                height={180}
                width={320}
                containerClassName="mx-10 my-4"
              />
              <Skeleton
                height={180}
                width={320}
                containerClassName="mx-10 my-4"
              />
              <Skeleton
                height={180}
                width={320}
                containerClassName="mx-10 my-4"
              />
            </div>
          </div>
        </>
      )}
      {products && (
        <>
          <main className="bg-[#E1D7C6] overflow-hidden">
            {/* slider */}
            <section>
              <div className="items-center place-content-around grid grid-cols-3 mt-12 mx-3 sm:ml-20 sm:mt-20 sm:mb-20 border-[#FB43F3F] border-8 rounded-xl p-3">
                {products &&
                  products[page].map((product, index) => {
                    return (
                      <Card
                        key={index}
                        {...product}
                        setSearchQuery={setSearchQuery}
                      />
                    );
                  })}
              </div>
            </section>
            <div className="flex place-content-center mb-8 my-12 sm:mb-24 text-xl row-span-1 items-center">
              <button
                className="mx-4 bg-[#295F98] text-white p-3 px-4"
                onClick={() => handlePrev()}
              >
                &lt;
              </button>
              <div>
                {products.map((_, index) => {
                  return (
                    <button
                      key={index}
                      className="mx-4 text-[#C7253E]"
                      onClick={() => setPage(index)}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              <button
                className="mx-4 bg-[#295F98] text-white p-3 px-4"
                onClick={() => handleNext()}
              >
                &gt;
              </button>
            </div>
          </main>
        </>
      )}
    </>
  );
};
export default Home;
