import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-600 to-blue-800 text-white py-20 md:py-32 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-400"></div>
          <div className="absolute top-1/2 -left-32 w-64 h-64 rounded-full bg-yellow-400"></div>
          <div className="absolute -bottom-32 right-1/3 w-80 h-80 rounded-full bg-blue-300"></div>
        </div>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">
                <span className="text-yellow-300">AI-Powered</span> Legal Document Assistant
              </h1>
              <p className="text-lg md:text-xl mb-8 text-blue-100 max-w-lg">
                Chat with your legal documents. Get instant summaries, explanations, and insights using advanced NLP and semantic understanding.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/chat">
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">Try Now</Button>
                </Link>
                <Button size="lg" className="bg-transparent border-2 border-white text-white font-medium hover:bg-white/20">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="w-full h-64 md:h-96 relative">
                <Image
                  src="/logos/hero.svg"
                  alt="AI analyzing legal documents"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent dark:from-background dark:to-transparent"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-white dark:bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-blue-600 font-semibold mb-2">ADVANCED CAPABILITIES</span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-primary">
              AI-Powered Legal Analysis
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform combines advanced natural language processing with legal expertise to deliver unmatched document analysis capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Vector Embeddings",
                description: "Transform legal text into high-dimensional vector space to capture semantic meaning and relationships between concepts.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
              },
              {
                title: "Semantic Search",
                description: "Find relevant legal information based on meaning and context, not just keywords. Discover connections across your documents.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
              },
              {
                title: "Knowledge Graphs",
                description: "Visualize complex legal relationships and hierarchies between entities, clauses, and concepts in your documents.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
              },
              {
                title: "Text Summarization",
                description: "Generate concise, accurate summaries of lengthy legal documents, briefs, contracts, and case law in seconds.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                ),
              },
              {
                title: "Text Simplification",
                description: "Translate complex legal jargon into plain, easy-to-understand language for clients and non-legal stakeholders.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                ),
              },
              {
                title: "Contextual Q&A",
                description: "Ask questions about your legal documents in natural language and receive accurate, relevant answers based on the content.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <Card key={index} className="border-2 border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-primary">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="services" className="py-16 md:py-24 bg-blue-50 dark:bg-blue-950/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-blue-600 font-semibold mb-2">CONVERSATION FLOW</span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-primary">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Chat with your legal documents in a natural, conversational way to extract insights and understanding.
            </p>
          </div>

          <div className="relative">
            {/* Remove the horizontal line completely */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {[
                {
                  step: "1",
                  title: "Upload Documents",
                  description: "Upload your legal documents, contracts, or case files to the secure platform.",
                },
                {
                  step: "2",
                  title: "Ask Questions",
                  description: "Interact with the AI using natural language to ask questions about your documents.",
                },
                {
                  step: "3",
                  title: "Receive Insights",
                  description: "Get instant answers, summaries, and explanations based on your legal texts.",
                },
                {
                  step: "4",
                  title: "Refine Queries",
                  description: "Ask follow-up questions and drill deeper into the content for greater understanding.",
                },
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center mb-4 font-bold text-lg shadow-lg">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-primary">{step.title}</h3>
                  <p className="text-muted-foreground text-center">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-white dark:bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-blue-600 font-semibold mb-2">USER EXPERIENCES</span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-primary">
              What Legal Professionals Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn how our AI assistant is transforming legal document understanding and analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "This AI assistant helped me quickly understand a 200-page contract in minutes. I was able to ask specific questions and get relevant answers instantly.",
                author: "Sarah Johnson",
                title: "Corporate Counsel, Tech Sector",
                image: "/testimonial-placeholder-1.svg",
              },
              {
                quote: "The semantic search capability found relevant case precedents that traditional keyword searches missed entirely. It's like having a research assistant that works at the speed of thought.",
                author: "Michael Chen",
                title: "Associate Attorney, Litigation",
                image: "/testimonial-placeholder-2.svg",
              },
              {
                quote: "Explaining complex legal concepts to clients is now much easier. I can ask the AI to simplify specific sections of agreements and share the plain language explanations.",
                author: "Elena Rodriguez",
                title: "Solo Practitioner",
                image: "/testimonial-placeholder-3.svg",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-2 border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="mb-6">
                    <svg className="h-8 w-8 text-accent" fill="currentColor" viewBox="0 0 32 32">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                  </div>
                  <CardDescription className="text-base text-foreground flex-grow mb-6">
                    "{testimonial.quote}"
                  </CardDescription>
                </CardHeader>
                <CardFooter className="border-t border-border pt-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.author}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">
                        {testimonial.author}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 md:py-24 bg-blue-50 dark:bg-blue-950/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-blue-600 font-semibold mb-2">ABOUT US</span>
              <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6 text-primary">
                About LegalAI
              </h2>
              <p className="text-muted-foreground mb-6">
                LegalAI is an intelligent platform designed to transform the way legal documents are understood and accessed. By leveraging cutting-edge natural language processing and machine learning, LegalAI simplifies complex legal texts, enabling clearer interpretation, smarter search, and interactive engagement with legal content.
              </p>
              <p className="text-muted-foreground mb-6">
                Built with a strong emphasis on accuracy, security, and responsible AI use, LegalAI supports the legal industry’s need for transparency and efficiency. From statute extraction and semantic search to document summarization and conversational querying, the system is engineered to integrate seamlessly into legal workflows while making legal information more accessible to a broader audience.
              </p>
              <p className="text-muted-foreground">
                At its core, LegalAI is driven by a commitment to bridge the gap between legal complexity and everyday understanding—empowering users to interact with the law, not just read it.
              </p>
            </div>
            <div className="relative h-64 md:h-96">
              <Image
                src="/logos/about.svg"
                alt="LegalAI Team"
                fill
                className="object-cover rounded-lg shadow-lg opacity-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6">
            Ready to Transform Your Legal Document Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start chatting with your legal documents today and discover insights, explanations, and summaries in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">Try LegalAI Now</Button>
            </Link>
            <Button size="lg" className="bg-transparent border-2 border-white text-white font-medium hover:bg-white/20">
              Explore Features
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 bg-white dark:bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <span className="inline-block text-blue-600 font-semibold mb-2">CONTACT US</span>
              <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6 text-primary">
                Get in Touch
              </h2>
              <p className="text-muted-foreground mb-6">
                Have questions about how LegalAI can help your organization? Our team is ready to assist you.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-primary">Email</h3>
                    <p className="text-muted-foreground">methsaradisanayaka@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-primary">Phone</h3>
                    <p className="text-muted-foreground">+94 (77) 218-2892</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-primary">Address</h3>
                    <p className="text-muted-foreground">Faculty of Computing<br />NSBM</p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="border-2 border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">Message</label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring bg-background"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <Button className="w-full">Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>      {/* Partners/Clients Section */}
      <section className="py-12 bg-blue-50 dark:bg-blue-950/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold font-serif text-primary">Trusted by Legal Professionals Worldwide</h2>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="flex items-center justify-center">
                <div className="h-16 w-32 relative">
                  <Image
                    src={`/logos/${item}.svg`}
                    alt={`Client Logo ${item}`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}