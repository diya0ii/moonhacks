"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, MapPin, ChevronRight, Users, Award, BookOpen, Code, Cloud, Laptop } from 'lucide-react';
import { useAuth, useUser } from "@clerk/nextjs";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Club data
const clubs = [
  {
    id: "ieee", name: "IEEE", 
    icon: <Award className="w-10 h-10 text-purple-600" />,
    description: "IEEE provides opportunities for students to engage with cutting-edge technologies and network with professionals.",
    color: "bg-purple-50"
  },
  {
    id: "acm", name: "ACM",
    icon: <BookOpen className="w-10 h-10 text-purple-600" />,
    description: "The ACM Student Chapter promotes knowledge sharing, learning, and professional growth among computing students.",
    color: "bg-purple-100"
  },
  {
    id: "aws", name: "AWS",
    icon: <Cloud className="w-10 h-10 text-purple-600" />,
    description: "The AWS Student Club provides resources to learn about cloud computing and Amazon Web Services.",
    color: "bg-purple-50"
  },
  {
    id: "gdg", name: "GDG",
    icon: <Code className="w-10 h-10 text-purple-600" />,
    description: "Google Developer Groups organizes events, workshops, and hackathons focused on Google technologies.",
    color: "bg-purple-100"
  },
  {
    id: "stic", name: "STIC",
    icon: <Laptop className="w-10 h-10 text-purple-600" />,
    description: "The Student Technical Innovation Club fosters innovation and entrepreneurship among students.",
    color: "bg-purple-50"
  }
];

export default function Home() {
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  
  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events?upcoming=true&limit=6');
        const data = await response.json();
        
        if (data.success) {
          setEvents(data.events || []);
          setFeaturedEvents(data.featuredEvents || []);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  // GSAP animations
  useEffect(() => {
    // Hero section animation
    gsap.fromTo(".hero-content > *", 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 }
    );
    
    // Animate sections on scroll
    const sections = [".clubs-grid", ".events-section", ".about-section"];
    
    sections.forEach(section => {
      gsap.fromTo(
        `${section} > *`,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: section,
            start: "top 75%"
          }
        }
      );
    });
    
    return () => ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }, []);
  
  // Format date for events
  const formatEventDate = (dateString : any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center bg-gradient-to-br from-white to-purple-50">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-200 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-purple-300 opacity-20 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 z-10 text-center hero-content">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4">
            <span className="text-purple-600">Medicaps</span> University
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto mb-8">
            Empowering students through innovation and excellence
          </p>
          
          {/* Role-based navigation buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <button 
              onClick={() => router.push('/admin')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md flex items-center"
            >
              <Users className="w-5 h-5 mr-2" />
              Admin Portal
            </button>
            <button 
              onClick={() => router.push('/leader')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-md flex items-center"
            >
              <Award className="w-5 h-5 mr-2" />
              Club Leaders
            </button>
            <button 
              onClick={() => router.push('/member')}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-md flex items-center"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Members Area
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="#clubs" 
              className="px-8 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition-colors"
            >
              Explore Clubs
            </Link>
            <Link 
              href="#events" 
              className="px-8 py-3 bg-white text-purple-600 border border-purple-200 rounded-full font-medium hover:bg-purple-50 transition-colors"
            >
              Events
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <div className="animate-bounce">
            <ChevronRight className="w-6 h-6 text-purple-600 rotate-90" />
          </div>
        </div>
      </section>
      
      {/* Clubs Section */}
      <section id="clubs" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our <span className="text-purple-600">Technical Clubs</span>
          </h2>
          
          <div className="clubs-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <div 
                key={club.id} 
                className={`${club.color} rounded-xl p-6 shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1`}
              >
                <div className="mb-4">
                  {club.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{club.name}</h3>
                <p className="text-gray-700 mb-4 text-sm">{club.description}</p>
                <Link 
                  href={`/clubs/${club.id}`} 
                  className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700"
                >
                  Learn more <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Events Section */}
      <section id="events" className="py-16 bg-purple-50">
        <div className="container mx-auto px-4 events-section">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Upcoming <span className="text-purple-600">Events</span>
          </h2>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.length > 0 ? (
                events.map((event : any) => (
                  <div 
                    key={event._id} 
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1"
                  >
                    <div className="relative h-40">
                      <Image 
                        src={event.coverImage || "/placeholder.svg?height=300&width=500"} 
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      {featuredEvents.some( (fe : any)=> fe._id === event._id) && (
                        <div className="absolute top-3 left-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatEventDate(event.startDate)}</span>
                        {event.club && (
                          <>
                            <div className="mx-2 w-1 h-1 bg-gray-300 rounded-full"></div>
                            <span>{event.club.name}</span>
                          </>
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h4>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{event.venue || "Medicaps Campus"}</span>
                      </div>
                      <Link 
                        href={`/events/${event._id}`} 
                        className="inline-flex items-center text-purple-600 text-sm font-medium hover:text-purple-700"
                      >
                        View details <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500">No upcoming events at the moment. Check back soon!</p>
                </div>
              )}
            </div>
          )}
          
          {events.length > 0 && (
            <div className="mt-10 text-center">
              <Link 
                href="/events" 
                className="px-6 py-3 bg-white text-purple-600 border border-purple-200 rounded-full font-medium hover:bg-purple-50 transition-colors"
              >
                View All Events
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="py-16 bg-white about-section">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                About <span className="text-purple-600">Medicaps</span>
              </h2>
              <p className="text-gray-700 mb-4">
                Medicaps University is one of the premier educational institutions in Central India, known for its excellence in technical education and research. With state-of-the-art infrastructure and a focus on holistic development, we prepare students to become industry-ready professionals.
              </p>
              <p className="text-gray-700 mb-6">
                Our technical clubs play a vital role in enhancing the learning experience beyond the classroom, providing opportunities for hands-on experience and skill development.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">5000+</h4>
                    <p className="text-sm text-gray-600">Students</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">20+</h4>
                    <p className="text-sm text-gray-600">Technical Clubs</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">100+</h4>
                    <p className="text-sm text-gray-600">Events Yearly</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 rounded-xl overflow-hidden shadow-xl">
                <Image 
                  src="/placeholder.svg?height=600&width=800" 
                  alt="Medicaps Campus"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-purple-100 rounded-xl -z-10"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-200 rounded-xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-14 bg-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated with Medicaps</h2>
          <p className="max-w-xl mx-auto mb-6">
            Subscribe to our newsletter for updates about upcoming events and opportunities.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
              required
            />
            <button 
              type="submit" 
              className="px-6 py-3 bg-white text-purple-600 rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}