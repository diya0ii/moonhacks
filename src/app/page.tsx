"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, MapPin, ChevronRight, Users, Award, BookOpen, Code, Cloud, Laptop, Clock, Video } from 'lucide-react';
import { useAuth, useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

// Enhanced EventCard Component
function EventCard({ event }) {
  const [showJitsi, setShowJitsi] = useState(false);

  const getStatusBadge = (status) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-500">
            Upcoming
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const joinMeeting = () => {
    setShowJitsi(true);
  };

  const closeMeeting = () => {
    setShowJitsi(false);
  };

  return (
    <Card className="transform transition-all duration-300 hover:translate-y-1 hover:shadow-lg bg-white/90 backdrop-blur">
      {/* Event Image */}
      <div className="w-full h-48 overflow-hidden rounded-t-lg">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{event.title}</CardTitle>
          {getStatusBadge(event.status)}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="mb-4 text-sm text-gray-600">{event.description}</p>
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center text-gray-500">
            <Calendar className="mr-2 h-4 w-4 text-purple-500" />
            <span>Date: {event.date}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Clock className="mr-2 h-4 w-4 text-purple-500" />
            <span>Start Time: {event.startTime}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <MapPin className="mr-2 h-4 w-4 text-purple-500" />
            <span>Location: {event.location}</span>
          </div>
          
          {event.status === "upcoming" && !showJitsi && (
            <div className="pt-3">
              <Link 
                href={`/events/${event.id}`} 
                className="inline-flex items-center text-purple-600 text-sm font-medium hover:text-purple-700"
              >
                View details <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Sample event data (to replace API call)
const sampleEvents = [
  {
    id: "event-1",
    title: "IEEE Technical Workshop",
    description: "Join us for an intensive workshop on artificial intelligence and machine learning fundamentals.",
    date: "March 25, 2025",
    startTime: "10:00 AM IST",
    location: "Medicaps Campus, Lab 302",
    status: "upcoming",
    imageUrl: "/one.jpg",
    club: { name: "IEEE" }
  },
  {
    id: "event-2",
    title: "Cloud Computing Seminar",
    description: "Learn about modern cloud architectures and deployment strategies from industry experts.",
    date: "March 28, 2025",
    startTime: "2:30 PM IST",
    location: "Virtual Event",
    status: "upcoming",
    imageUrl: "/two.jpg",
    club: { name: "AWS" }
  },
  {
    id: "event-3",
    title: "Hackathon 2025",
    description: "72-hour coding competition to solve real-world problems using technology.",
    date: "April 5, 2025",
    startTime: "9:00 AM IST",
    location: "Medicaps Innovation Hub",
    status: "upcoming",
    imageUrl: "/one.jpg",
    club: { name: "GDG" }
  },
  {
    id: "event-4",
    title: "Networking Night",
    description: "Connect with industry professionals and alumni to expand your professional network.",
    date: "April 12, 2025",
    startTime: "6:00 PM IST",
    location: "Medicaps Auditorium",
    status: "upcoming",
    imageUrl: "/two.jpg",
    club: { name: "STIC" }
  },
  {
    id: "event-5",
    title: "Web Development Bootcamp",
    description: "Intensive 2-day bootcamp covering modern web development technologies and frameworks.",
    date: "April 15, 2025",
    startTime: "10:00 AM IST",
    location: "Computer Lab, Block B",
    status: "upcoming",
    imageUrl: "/one.jpg",
    club: { name: "ACM" }
  },
  {
    id: "event-6",
    title: "Tech Talk: Future of AI",
    description: "Industry experts discuss the future implications of artificial intelligence on society and technology.",
    date: "April 20, 2025",
    startTime: "4:00 PM IST",
    location: "Medicaps Seminar Hall",
    status: "upcoming",
    imageUrl: "/two.jpg",
    club: { name: "IEEE" }
  }
];

// Define featured events
const featuredEventIds = ["event-1", "event-3", "event-6"];

export default function Home() {
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  
  // Set event data (replacing API fetch)
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setEvents(sampleEvents);
      setFeaturedEvents(sampleEvents.filter(event => featuredEventIds.includes(event.id)));
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
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
              href="/events" 
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
      
      {/* Enhanced Events Section */}
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
                events.map((event) => (
                  <div key={event.id} className="relative">
                    {featuredEvents.some(fe => fe.id === event.id) && (
                      <div className="absolute top-3 left-3 z-10 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Featured
                      </div>
                    )}
                    <EventCard event={event} />
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
                  src="/collage.jpg" 
                  alt="Medicaps Campus"
                  width={400}
                  height={300}
                  objectFit="cover"
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