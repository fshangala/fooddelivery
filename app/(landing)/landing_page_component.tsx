'use client';

import { useAuth } from '@/lib/components/auth_provider';
import Link from 'next/link';

export default function LandingPageComponent() {
    const session = useAuth();
    
    return (
        <div className="min-h-screen bg-linear-to-b from-primary-50 to-white">
            {/* Hero Section */}
            <section className="px-4 sm:px-6 lg:px-8 pt-20 pb-24">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full">
                                    <span className="text-lg">🌿</span>
                                    <span className="text-sm font-medium text-primary-700">100% Fresh & Organic</span>
                                </div>
                                <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
                                    Fresh Vegetables Delivered to Your Door
                                </h1>
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    Get farm-fresh vegetables and quality groceries delivered right to your home. 
                                    Supporting local farmers while ensuring your family eats healthy.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link href="/register">
                                    <button className="w-full sm:w-auto px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl cursor-pointer">
                                        Order Now
                                    </button>
                                </Link>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex gap-8 pt-4">
                                <div>
                                    <p className="text-3xl font-bold text-gray-900">500+</p>
                                    <p className="text-gray-600">Happy Customers</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-gray-900">50+</p>
                                    <p className="text-gray-600">Product Types</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-gray-900">24hrs</p>
                                    <p className="text-gray-600">Free Delivery</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Image Section */}
                        <div className="relative">
                            <div className="bg-linear-to-br from-primary-400 to-secondary-600 rounded-2xl aspect-square flex items-center justify-center overflow-hidden">
                                <div className="grid grid-cols-2 gap-4 p-8">
                                    <div className="bg-white/20 rounded-lg p-4 flex items-center justify-center">
                                        <span className="text-6xl">🥗</span>
                                    </div>
                                    <div className="bg-white/20 rounded-lg p-4 flex items-center justify-center">
                                        <span className="text-6xl">🥕</span>
                                    </div>
                                    <div className="bg-white/20 rounded-lg p-4 flex items-center justify-center">
                                        <span className="text-6xl">🍅</span>
                                    </div>
                                    <div className="bg-white/20 rounded-lg p-4 flex items-center justify-center">
                                        <span className="text-6xl">🥬</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="px-4 sm:px-6 lg:px-8 py-24 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose FreshVeg?</h2>
                        <p className="text-lg text-gray-600">Everything you need for a healthy lifestyle</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-linear-to-br from-primary-50 to-white p-8 rounded-xl border border-primary-100 hover:border-primary-300 transition-colors">
                            <div className="text-4xl mb-4">🌱</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Fresh</h3>
                            <p className="text-gray-600">Farm to table in 24 hours. No preservatives, no pesticides.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-linear-to-br from-secondary-50 to-white p-8 rounded-xl border border-secondary-100 hover:border-secondary-300 transition-colors">
                            <div className="text-4xl mb-4">🚚</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
                            <p className="text-gray-600">Free delivery in 24 hours. Track your order in real-time.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-linear-to-br from-primary-50 to-white p-8 rounded-xl border border-primary-100 hover:border-primary-300 transition-colors">
                            <div className="text-4xl mb-4">✅</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Ordering</h3>
                            <p className="text-gray-600">Simple, intuitive ordering process. Quick and convenient.</p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-linear-to-br from-secondary-50 to-white p-8 rounded-xl border border-secondary-100 hover:border-secondary-300 transition-colors">
                            <div className="text-4xl mb-4">⭐</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Assured</h3>
                            <p className="text-gray-600">Hand-picked products. Money-back satisfaction guarantee.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Category Section */}
            <section className="px-4 sm:px-6 lg:px-8 py-24 bg-linear-to-b from-white to-primary-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h2>
                        <p className="text-lg text-gray-600">Handpicked fresh vegetables delivered to you</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Product Card 1 */}
                        <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                            <div className="bg-linear-to-br from-orange-100 to-orange-50 aspect-video flex items-center justify-center text-7xl group-hover:scale-110 transition-transform">🥕</div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Fresh Vegetables</h3>
                                <p className="text-gray-600 mb-4">Carrots, tomatoes, lettuce, and more fresh produce.</p>
                            </div>
                        </div>

                        {/* Product Card 2 */}
                        <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                            <div className="bg-linear-to-br from-red-100 to-red-50 aspect-video flex items-center justify-center text-7xl group-hover:scale-110 transition-transform">🍎</div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Fresh Fruits</h3>
                                <p className="text-gray-600 mb-4">Apples, bananas, oranges, and seasonal fruits.</p>
                            </div>
                        </div>

                        {/* Product Card 3 */}
                        <div className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                            <div className="bg-linear-to-br from-amber-100 to-amber-50 aspect-video flex items-center justify-center text-7xl group-hover:scale-110 transition-transform">🥔</div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Pantry Staples</h3>
                                <p className="text-gray-600 mb-4">Potatoes, onions, grains, and dairy products.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="px-4 sm:px-6 lg:px-8 py-24 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-lg text-gray-600">Simple steps to get fresh food delivered</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { num: '1', title: 'Sign Up', desc: 'Create your account in seconds' },
                            { num: '2', title: 'Browse', desc: 'Explore our fresh products' },
                            { num: '3', title: 'Order', desc: 'Select items and place order' },
                            { num: '4', title: 'Enjoy', desc: 'Fresh food delivered to you' }
                        ].map((step, idx) => (
                            <div key={idx} className="text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="w-16 h-16 bg-linear-to-br from-primary-600 to-secondary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                                        {step.num}
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                                <p className="text-gray-600">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="px-4 sm:px-6 lg:px-8 py-24 bg-linear-to-b from-white to-primary-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
                        <p className="text-lg text-gray-600">Join thousands of satisfied customers</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Sarah Johnson', text: 'The vegetables are so fresh and delicious! I love the convenience of delivery.', rating: 5 },
                            { name: 'Mike Chen', text: 'Best quality produce in town. The delivery is always on time and well-packaged.', rating: 5 },
                            { name: 'Emma Davis', text: 'I switched to FreshVeg for health reasons and I\'m not looking back. Highly recommended!', rating: 5 }
                        ].map((testimonial, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <span key={i} className="text-yellow-400">⭐</span>
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                                <p className="font-semibold text-gray-900">— {testimonial.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="px-4 sm:px-6 lg:px-8 py-24 bg-linear-to-r from-primary-600 to-secondary-600">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">Get Fresh Deals Every Week</h2>
                    <p className="text-white/90 text-lg mb-8">Subscribe to our newsletter and get exclusive discounts on fresh produce.</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input 
                            type="email" 
                            placeholder="Enter your email address" 
                            className="flex-1 px-6 py-4 text-white rounded-lg focus:outline-none ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 placeholder:text-white font-medium"
                        />
                        <button className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap cursor-pointer">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-4 sm:px-6 lg:px-8 py-24 bg-white border-t border-gray-200">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Eat Fresh?</h2>
                    <p className="text-xl text-gray-600 mb-8">Start your healthy journey today with FreshVeg</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/register">
                            <button className="w-full sm:w-auto px-10 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg text-lg cursor-pointer">
                                Order Now
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}