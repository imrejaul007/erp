'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Truck,
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function HomePage() {
  const { data: session, status } = useSession();

  // Redirect authenticated users to dashboard
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-oud-50 to-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-oud-500"></div>
      </div>
    );
  }

  if (session) {
    redirect('/dashboard');
  }

  const features = [
    {
      icon: Package,
      title: 'Inventory Management',
      description: 'Track your perfume and oud inventory with real-time stock levels, batch tracking, and automated reorder alerts.',
    },
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Manage your customer relationships with detailed profiles, purchase history, and personalized service tracking.',
    },
    {
      icon: ShoppingCart,
      title: 'Order Processing',
      description: 'Streamline your sales process with efficient order management, payment tracking, and fulfillment workflows.',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Get insights into your business performance with comprehensive reporting and analytics dashboards.',
    },
    {
      icon: Truck,
      title: 'Supply Chain',
      description: 'Manage suppliers, purchase orders, and procurement processes for seamless supply chain operations.',
    },
    {
      icon: Star,
      title: 'Quality Control',
      description: 'Ensure product quality with batch tracking, quality assessments, and compliance management.',
    },
  ];

  const benefits = [
    'Real-time inventory tracking',
    'Automated low-stock alerts',
    'Customer purchase history',
    'Sales performance analytics',
    'Supplier management',
    'Quality control workflows',
    'Mobile-responsive design',
    'Secure data encryption',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-oud-50 to-amber-50">
      {/* Header */}
      <header className="border-b border-oud-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-oud-500 to-oud-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-serif font-semibold luxury-text-gradient">
              Oud & Perfume ERP
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button variant="luxury" asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 luxury-text-gradient">
            Luxury Fragrance
            <br />
            Business Management
          </h1>
          <p className="text-xl text-oud-700 mb-8 max-w-2xl mx-auto">
            Streamline your perfume and oud business operations with our comprehensive ERP system designed specifically for luxury fragrance retailers and distributors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="luxury" asChild>
              <Link href="/auth/signup">
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">Request Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-oud-800">
              Everything You Need to Run Your Business
            </h2>
            <p className="text-lg text-oud-600 max-w-2xl mx-auto">
              Our comprehensive ERP solution provides all the tools you need to manage your perfume and oud business efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-luxury hover:shadow-luxury-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-oud-500 to-oud-600 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-oud-800">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-oud-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-oud-800">
                Why Choose Our ERP System?
              </h2>
              <p className="text-lg text-oud-600 mb-8">
                Built specifically for the luxury fragrance industry, our ERP system understands the unique challenges of managing perfume and oud businesses.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-oud-500 flex-shrink-0" />
                    <span className="text-oud-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-effect rounded-2xl p-8">
              <div className="bg-gradient-to-br from-oud-500 to-oud-600 rounded-xl p-6 text-white">
                <h3 className="text-2xl font-semibold mb-4">Ready to Get Started?</h3>
                <p className="mb-6 opacity-90">
                  Join hundreds of perfume businesses already using our ERP system to streamline their operations.
                </p>
                <Button size="lg" className="w-full bg-white text-oud-600 hover:bg-oud-50" asChild>
                  <Link href="/auth/signup">Start Free Trial</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-oud-900 text-oud-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-oud-500 to-oud-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-serif font-semibold">Oud & Perfume ERP</span>
              </div>
              <p className="text-oud-300">
                The complete business management solution for luxury fragrance businesses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-oud-300">
                <li><Link href="/features" className="hover:text-oud-200">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-oud-200">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-oud-200">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-oud-300">
                <li><Link href="/docs" className="hover:text-oud-200">Documentation</Link></li>
                <li><Link href="/support" className="hover:text-oud-200">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-oud-200">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-oud-300">
                <li><Link href="/about" className="hover:text-oud-200">About</Link></li>
                <li><Link href="/privacy" className="hover:text-oud-200">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-oud-200">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-oud-700 mt-12 pt-8 text-center text-oud-300">
            <p>&copy; 2024 Oud & Perfume ERP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}