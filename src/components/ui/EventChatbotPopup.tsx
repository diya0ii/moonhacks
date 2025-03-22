import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { X, MessageSquare } from 'lucide-react';

// Define message types
type MessageType = 'user' | 'bot' | 'options';

interface Message {
  id: string;
  type: MessageType;
  content: string;
  options?: string[];
}

interface ChatbotProps {
  apiKey?: string;
  isFloating?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const EventChatbotPopup: React.FC<ChatbotProps> = ({ 
  apiKey, 
  isFloating = true,
  isOpen: externalIsOpen,
  onClose
}) => {
  // If isOpen is provided externally, use that value; otherwise manage state internally
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  // Determine which isOpen to use based on whether it's controlled externally
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  // Function to handle closing the popup
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your event planning assistant. How can I help you organize your next event?'
    }           
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        handleClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: generateUniqueId(),
      type: 'user',
      content: inputValue
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Call to Groq API
      const response = await callGroqAPI(userMessage.content);
      
      // Parse the response for content and options
      const { textResponse, options } = parseResponse(response);
      
      // Add bot response to chat
      const botMessage: Message = {
        id: generateUniqueId(),
        type: 'bot',
        content: textResponse
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // If there are options, add them as a separate message
      if (options && options.length > 0) {
        const optionsMessage: Message = {
          id: generateUniqueId(),
          type: 'options',
          content: 'Here are some actions you might consider:',
          options
        };
        
        setMessages(prev => [...prev, optionsMessage]);
      }
    } catch (error) {
      console.error('Error calling Groq API:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: generateUniqueId(),
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again later.'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionClick = (option: string) => {
    // Add the selected option as a user message
    const optionMessage: Message = {
      id: generateUniqueId(),
      type: 'user',
      content: `I'd like to ${option}`
    };
    
    setMessages(prev => [...prev, optionMessage]);
    
    // Process the selected option
    handleSendMessage();
  };

  const callGroqAPI = async (userInput: string) => {
    // Groq API endpoint
    const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey || process.env.NEXT_PUBLIC_GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', // You can also use 'mixtral-8x7b-32768' or other Groq models
        messages: [
          {
            role: 'system',
            content: `You are an event planning assistant helping leads organize events. 
            Provide helpful, concise advice about event planning. 
            For each response, include 3-5 actionable options that the user might want to take next.
            Format your response as JSON with two fields: 
            1. "text" - Your helpful response to the user (keep this under 150 words)
            2. "options" - An array of action items, each under 5 words`
          },
          {
            role: 'user',
            content: userInput
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  };

  const parseResponse = (apiResponse: any) => {
    try {
      // Extract the content from the API response
      const content = apiResponse.choices[0].message.content;
      
      // Try to parse the JSON content
      try {
        const parsedContent = JSON.parse(content);
        return {
          textResponse: parsedContent.text,
          options: parsedContent.options
        };
      } catch (jsonError) {
        // If JSON parsing fails, extract options using a regex pattern
        console.warn('Failed to parse JSON, attempting to extract options manually', jsonError);
        
        // Return the whole response as text
        const options = ['Schedule planning meeting', 'Create event budget', 'Find venue options', 'Set event date'];
        return {
          textResponse: content,
          options
        };
      }
    } catch (error) {
      console.error('Error parsing API response:', error);
      return {
        textResponse: 'I received a response but had trouble processing it. How can I help with your event planning?',
        options: ['Schedule planning meeting', 'Create event budget', 'Find venue options']
      };
    }
  };

  // Chat popup content
  const chatPopup = isOpen && (
    <div 
      className={`${isFloating ? 'fixed bottom-24 right-6' : 'relative'} w-96 shadow-xl z-50`}
      ref={popupRef}
    >
      <Card className="w-full h-96 flex flex-col">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Event Assistant</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 rounded-full" 
            onClick={handleClose}
          >
            <X size={18} />
          </Button>
        </CardHeader>
        <Separator />
        <CardContent className="flex-grow overflow-auto pt-4 pb-0">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                {message.type === 'user' && (
                  <div className="flex justify-end mb-4">
                    <div className="bg-blue-500 text-white rounded-lg p-2 max-w-[80%] text-sm">
                      {message.content}
                    </div>
                  </div>
                )}
                
                {message.type === 'bot' && (
                  <div className="flex mb-4">
                    <div className="bg-gray-200 rounded-lg p-2 max-w-[80%] text-sm">
                      {message.content}
                    </div>
                  </div>
                )}
                
                {message.type === 'options' && (
                  <div className="flex flex-col mb-4">
                    <div className="bg-gray-200 rounded-lg p-2 max-w-[80%] mb-2 text-sm">
                      {message.content}
                    </div>
                    <div className="flex flex-wrap gap-1 ml-1">
                      {message.options?.map((option, index) => (
                        <Button 
                          key={index}
                          variant="outline"
                          size="sm"
                          className="mt-1 text-xs" 
                          onClick={() => handleOptionClick(option)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter className="border-t p-2">
          <div className="flex w-full items-center space-x-2">
            <Input
              className="text-sm"
              placeholder="Type your question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
            />
            <Button size="sm" onClick={handleSendMessage} disabled={isLoading}>
              {isLoading ? '...' : 'Send'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );

  return (
    <div className="relative z-50">
      {/* Floating button that shows only in floating mode */}
      {isFloating && (
        <Button 
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg flex items-center justify-center"
          onClick={() => setInternalIsOpen(true)}
          aria-label="Open Event Planning Assistant"
        >
          <MessageSquare size={24} />
        </Button>
      )}

      {/* Chat popup */}
      {chatPopup}
    </div>
  );
};

export default EventChatbotPopup;