import { Link } from 'react-router-dom';
import {
    Users,
    CreditCard,
    FileText,
    Clock,
    ShieldCheck,
    CheckCircle,
} from 'lucide-react';

const PersonalAccounts = () => {
    const benefits = [
        {
            icon: <Clock className="h-6 w-6" />,
            title: 'Priority Booking Access',
            description:
                'Enjoy faster response times with a dedicated priority booking line for account holders.',
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: 'Family & Multi-User Management',
            description:
                'Manage bookings for the whole family from a single account with clear journey references.',
        },
        {
            icon: <FileText className="h-6 w-6" />,
            title: 'Clear Expense Tracking',
            description:
                'View a full breakdown of journeys and costs without keeping individual receipts.',
        },
        {
            icon: <ShieldCheck className="h-6 w-6" />,
            title: 'Custom Booking Instructions',
            description:
                'Save special requirements and preferences for smoother, more personalized journeys.',
        },
        {
            icon: <CreditCard className="h-6 w-6" />,
            title: 'Flexible Monthly Billing',
            description:
                'Pay conveniently by Direct Debit or Bank Transfer with consolidated monthly invoices.',
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Personal Accounts
                        </h1>
                        <p className="text-xl text-primary-100">
                            A smarter way to manage airport taxi bookings for you and your
                            family
                        </p>
                    </div>
                </div>
            </section>

            {/* Intro Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Text */}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Travel Made Simple
                            </h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    A Personal Account with AirportRide gives you an easy and
                                    efficient way to organise taxi bookings for yourself and your
                                    family. Keep everything in one place while enjoying priority
                                    service and flexible payment options.
                                </p>
                                <p>
                                    With monthly invoicing and detailed journey records, managing
                                    travel expenses becomes effortless—no paperwork, no confusion,
                                    and no missed details.
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                <Link
                                    to="/register"
                                    className="btn-primary text-center px-6 py-3"
                                >
                                    Register Account
                                </Link>
                                <Link
                                    to="/login"
                                    className="px-6 py-3 rounded-lg border border-primary-600 text-primary-600 font-semibold hover:bg-primary-50 transition-colors text-center"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>

                        {/* Image */}
                        <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&h=600&fit=crop"
                                alt="Premium airport taxi"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose a Personal Account?
                        </h2>
                        <p className="text-lg text-gray-600">
                            Designed for convenience, transparency, and peace of mind
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {benefits.map((item, index) => (
                            <div key={index} className="card hover:shadow-xl transition-shadow">
                                <div className="flex items-start space-x-4">
                                    <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 text-primary-600 rounded-full flex-shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Summary Section */}
            <section className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="card">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">
                            Everything You Need in One Account
                        </h3>
                        <div className="space-y-4">
                            {[
                                'Dedicated accounts team for billing and invoicing support',
                                'Clear monthly statements with journey-level details',
                                'Flexible payment options for your convenience',
                                'Trusted service backed by experienced professional drivers',
                            ].map((point, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <CheckCircle className="h-6 w-6 text-primary-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">{point}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Simplify Your Travel?
                    </h2>
                    <p className="text-xl mb-8 text-primary-100">
                        Create a Personal Account today and manage every journey with ease
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="inline-block bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors"
                        >
                            Register Now
                        </Link>
                        <Link
                            to="/login"
                            className="inline-block border border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PersonalAccounts;
