import { useState } from "react";
import { Calendar, Clock, MapPin, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function EventCardOne() {
  const [showJitsi, setShowJitsi] = useState(false);

  return (
    <div className="w-1/2 p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform hover:scale-105">
        {/* Background Image */}
        <div
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: "url('/one.jpg')" }}
        ></div>

        {/* Card Content */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Weekly Club Meeting</h2>
            <Badge variant="outline" className="border-blue-500 text-blue-500">Upcoming</Badge>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Join us for our weekly discussion on the latest industry trends and networking.
          </p>
          <div className="mt-4 space-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-indigo-500" />
              <span>March 22, 2025</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-indigo-500" />
              <span>6:30 PM EST</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-indigo-500" />
              <span>Community Center, Room 204</span>
            </div>
          </div>

          {/* Join Meeting Button */}
          {!showJitsi && (
            <button
              onClick={() => setShowJitsi(true)}
              className="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
            >
              <Video className="mr-2 h-4 w-4" />
              Join Meeting
            </button>
          )}

          {/* Jitsi Meeting Embed */}
          {showJitsi && (
            <div className="mt-4">
              <div className="h-64 w-full rounded-md overflow-hidden">
                <iframe
                  src="https://meet.jit.si/club-meeting-2025-03-22"
                  allow="camera; microphone; fullscreen; display-capture; autoplay"
                  className="w-full h-full border-0"
                ></iframe>
              </div>
              <button
                onClick={() => setShowJitsi(false)}
                className="mt-2 w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-200"
              >
                Leave Meeting
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function EventCardTwo() {
  const [showJitsi, setShowJitsi] = useState(false);

  return (
    <div className="w-1/2 p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform hover:scale-105">
        {/* Background Image */}
        <div
          className="h-48 bg-cover bg-center"
          style={{ backgroundImage: "url('/two.jpg')" }}
        ></div>

        {/* Card Content */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Tech Workshop</h2>
            <Badge variant="outline" className="border-blue-500 text-blue-500">Upcoming</Badge>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Hands-on workshop exploring new technologies and their applications.
          </p>
          <div className="mt-4 space-y-2 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-indigo-500" />
              <span>March 24, 2025</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-indigo-500" />
              <span>2:00 PM EST</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-indigo-500" />
              <span>Innovation Lab</span>
            </div>
          </div>

          {/* Join Meeting Button */}
          {!showJitsi && (
            <button
              onClick={() => setShowJitsi(true)}
              className="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
            >
              <Video className="mr-2 h-4 w-4" />
              Join Meeting
            </button>
          )}

          {/* Jitsi Meeting Embed */}
          {showJitsi && (
            <div className="mt-4">
              <div className="h-64 w-full rounded-md overflow-hidden">
                <iframe
                  src="https://meet.jit.si/workshop-2025-03-24"
                  allow="camera; microphone; fullscreen; display-capture; autoplay"
                  className="w-full h-full border-0"
                ></iframe>
              </div>
              <button
                onClick={() => setShowJitsi(false)}
                className="mt-2 w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-200"
              >
                Leave Meeting
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EventsGrid() {
  return (
    <div className="flex justify-center items-start gap-6 p-4 max-w-6xl mx-auto">
      <EventCardOne />
      <EventCardTwo />
    </div>
  );
}
