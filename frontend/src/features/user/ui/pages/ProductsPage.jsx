import { useProducts } from '../../hooks/productsHook';
import Navbar from '../../../../shared/ui/components/Navbar';
import ProductCard from '../components/ProductCard';
import Loading from '../../../../shared/ui/pages/Loading'
import { Link } from 'react-router';

const ProductsPage = () => {

  const {data, isPending} = useProducts()

  if(isPending){
    return <Loading />
  }
  
  const products = data?.data?.products || []

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <section className="bg-white border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-6 py-16">

          <div className="max-w-2xl">

            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Discover
            </p>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mt-3">
              Find something
              <br />
              you’ll love.
            </h1>

            <p className="text-gray-500 mt-5 text-base leading-relaxed max-w-lg">
              Explore our collection of products and discover
              something made just for you.
            </p>

          </div>

        </div>

      </section>

      {/* Products */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-7">

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              All Products
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {products.length} products available
            </p>
          </div>

        </div>

        {products.length === 0
          ? <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                No products available
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Check back later for new products.
              </p>
            </div>
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

              {products.map (product => (
                <Link to={`/product/${product._id}`}>
                  <ProductCard key={product._id} product={product} />
                </Link>
              ))}

            </div>}

      </main>

    </div>
  );
};

export default ProductsPage;