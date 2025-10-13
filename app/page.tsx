import DragAndDropZone from "@/components/DragAndDropZone";
import HomeFeatureBlock from "@/components/HomeFeatureBlock";
import HomeFeatureIcon from "@/components/HomeFeatureIcon";
import HomePricingBlock from "@/components/HomePricingBlock";
import HomeSectionHeader from "@/components/HomeSectionHeader";
import { Button } from "@/components/ui/button";
import { ArrowRight, Container } from "lucide-react";
import Link from "next/link";
import HomeHeader from "@/components/HomeHeader";

export default function Home() {
  return (
    <>
      <HomeHeader />
      <div className="flex flex-col min-h-screen">
        {/* Hero */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-sky--50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <HomeSectionHeader
                title="Intelligent Receipt Scanning"
                description="Scan, analyze, and organize your receipts with AI-powered precision. Save time and gain insights from your expenses."
                isHero={true}
              />

              <div className="space-x-4">
                <Link href="/receipts">
                  <Button className="bg-blue-400 hover:bg-blue-200 hover:text-blue-900">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <Link href="#features">
                  <Button variant={"outline"}>Learn More</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Receipt drop zone */}
          <div className="mt-12 flex justify-center">
            <div className="relative w-full max-w-3xl rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden dark:border-gray-800 dark:bg-gray-950">
              <div className="p-6 md:p-8 relative">
                <DragAndDropZone />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <HomeSectionHeader
                title="Powerful features"
                description="Our AI-powered platform transforms how you handle receipts and track expenses."
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {/* Feature 1 */}
                <HomeFeatureBlock
                  title="Easy Uploads"
                  description="Drag and drop your receipts for instant scanning and processing"
                  icon={<HomeFeatureIcon color="sky" icon="upload" />}
                />

                {/* Feature 2 */}
                <HomeFeatureBlock
                  title="AI Analysis"
                  description="Automatically extract and categorize expense data with intelligent AI"
                  icon={<HomeFeatureIcon color="green" icon="search" />}
                />

                {/* Feature 3 */}
                <HomeFeatureBlock
                  title="Expense Insights"
                  description="Generate reports and gain valuable insights from your spending patterns"
                  icon={<HomeFeatureIcon color="blue" icon="bar-chart" />}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center justify-center">
              <HomeSectionHeader
                title="Simple Pricing"
                description="Choose a plan that fits your needs and start managing your expenses today."
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-5xl mx-auto">
                {/* Free Tier */}
                <HomePricingBlock
                  label="Free"
                  description="Free tier for all to try!"
                  price="0.00"
                  features={[
                    "2 Scans per month",
                    "Basic data extraction",
                    "7-day history",
                  ]}
                  buttonText="Sign Up Free"
                />

                {/* Starter Tier */}
                <HomePricingBlock
                  label="Starter"
                  description="A taste of expensing goodness!"
                  price="4.99"
                  features={[
                    "50 Scans per month",
                    "Enhanced data extraction",
                    "30-day history",
                    "Basic export options",
                  ]}
                  buttonText="Choose Plan"
                />

                {/* Pro Tier */}
                <HomePricingBlock
                  label="Pro"
                  description="Pro features for the pro user!"
                  price="9.99"
                  features={[
                    "300 Scans per month",
                    "Advanced AI data extraction",
                    "AI summaries",
                    "Expense categories and tags",
                    "Advanced export options",
                    "Unlimited history",
                  ]}
                  color="blue"
                  flagged={true}
                  buttonText="Get Started"
                  buttonClasses="w-full bg-blue-600 hover:bg-blue-700 text-white hover:text-white"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Info */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <HomeSectionHeader
                title="Start Scanning Today"
                description="Join thousands of users who save time and gain insights from their receipts."
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800">
          <div className="container px-4 md:px-6 py-8 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-1">
                <Container className="text-blue-300 text-3xl" />
                <h1 className="text-xl font-bold text-blue-300 flex items-center py-1.5">
                  money container
                </h1>
              </div>

              <div className="mt-4 md:mt-0">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  The most smartest way to track your consumption. <br />
                  &copy; {new Date().getFullYear()} All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
