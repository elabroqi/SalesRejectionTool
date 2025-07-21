import { useState, useEffect } from 'react';
import { Mic, MicOff, Phone, PhoneOff, Save, Settings } from 'lucide-react';

// Panel component definition
const Panel = ({ title, children }) => {
  const panelStyle = {
    backgroundColor: '#1F2937',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #374151',
    height: 'fit-content'
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: '2px solid #374151'
  };

  return (
    <div style={panelStyle}>
      <h3 style={titleStyle}>{title}</h3>
      {children}
    </div>
  );
};

// Use this style object for your headings
const fancyTitleStyle = {
  fontSize: 'clamp(2.5rem, 6vw, 5rem)', // Responsive size
  fontWeight: 800,
  textAlign: 'center',
  background: 'linear-gradient(90deg, #22c55e 30%, #16e0a0 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '1.5px',
  fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
  margin: '32px 0 16px 0',
  lineHeight: 1.1
};

function App() {
  const [backendData, setBackendData] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [restrictions, setRestrictions] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [speechText, setSpeechText] = useState("[Speech goes here]");
  const [aiResponse, setAiResponse] = useState("[AI-generated response here]");
  const [callNotes, setCallNotes] = useState("");
  const [transcript, setTranscript] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
  fetch('/api')
    .then((response) => response.json())
    .then((data) => {
      console.log('Data from /api:', data);
      setBackendData(data); 
    })
    .catch((err) => console.error('Error fetching /api:', err));
}, []);


  const testAddEndpoint = async () => {
    try {
      const response = await fetch('/api/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: 'Test from frontend' })
      });

      const data = await response.json();
      console.log('Response from backend:', data);
    } catch (error) {
      console.error('Error testing add endpoint:', error);
    }
  };

  // Check for speech recognition support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      setRecognition(recognitionInstance);
    }
  }, []);

  const fetchAIResponse = async (customerStatement, conversationContext) => {
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerStatement, conversationContext })
      });

      if (!res.ok) {
        const mockResponses = [
          "I understand your concern about the price. Let me show you the value you'll get for your investment.",
          "That's a great question! Many of our customers felt the same way initially, but found it was worth every penny.",
          "I appreciate your interest! Let me explain how this solution can specifically help your situation.",
          "I hear you on the cost. What if I could show you how this pays for itself within the first month?",
          "That's exactly why I wanted to talk with you today. Let me address those concerns directly."
        ];
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockResponses[Math.floor(Math.random() * mockResponses.length)];
      }

      const data = await res.json();
      return data.response;
    } catch (error) {
      console.error("Error generating AI response:", error);
      return `Error: ${error.message}`;
    }
  };

  const generateAIResponse = async (inputText = null) => {
    const customerStatement = inputText || speechText;
    const conversationContext = "The customer was initially interested but expressed concern about timing.";

    if (!customerStatement || customerStatement === "[Speech goes here]" || customerStatement === "Listening...") {
      alert("Please record some speech first or provide input!");
      return;
    }

    setIsGenerating(true);
    try {
      const generatedText = await fetchAIResponse(customerStatement, conversationContext);
      setAiResponse(generatedText);
      setTranscript(prev => [...prev, {
        speaker: "AI Suggestion",
        text: generatedText
      }]);
    } catch (err) {
      console.error("Error:", err);
      setAiResponse("Failed to generate response.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClick = async () => {
    const generatedText = await generateAIResponse(prompt);
    setAiResponse(generatedText);

    setTranscript(prev => [...prev, { 
      speaker: "AI Suggestion", 
      text: generatedText 
    }]);
  };

  const toggleCall = () => {
    setIsCallActive(!isCallActive);
    if (!isCallActive) {
      setTranscript(prev => [...prev, { speaker: "System", text: "Call started" }]);
    } else {
      setTranscript(prev => [...prev, { speaker: "System", text: "Call ended" }]);
      setIsRecording(false);
      if (recognition) {
        recognition.stop();
      }
    }
  };

  const toggleRecording = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (!isRecording) {
      recognition.onstart = () => {
        setSpeechText("Listening...");
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSpeechText(transcript);
        setTranscript(prev => [...prev, { 
          speaker: "Customer", 
          text: transcript 
        }]);
        // Auto-generate response after speech
        setTimeout(() => generateAIResponse(transcript), 500);
      };

      recognition.onerror = (event) => {
        setSpeechText("Error: " + event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      setIsRecording(true);
    } else {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const saveNotes = () => {
    if (callNotes.trim()) {
      alert("Call notes saved successfully!");
    } else {
      alert("Please enter some notes before saving.");
    }
  };

  // Inline styles for consistent rendering
  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#111827',
    color: 'white',
    padding: '24px',
    fontFamily: 'Inter, sans-serif'
  };

  const headerStyle = {
    marginBottom: '24px'
  };

  const controlBarStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  };

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    borderRadius: '8px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '14px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '24px'
  };

  const transcriptStyle = {
    height: '400px',
    overflowY: 'auto',
    padding: '8px'
  };

  const transcriptEntryStyle = {
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#4B5563',
    borderLeft: '4px solid #60A5FA',
    marginBottom: '12px'
  };

  const speakerStyle = {
    fontWeight: '600',
    color: '#E5E7EB',
    marginBottom: '4px'
  };

  const textAreaStyle = {
    width: '100%',
    height: '300px',
    padding: '12px',
    backgroundColor: '#1F2937',
    color: 'white',
    borderRadius: '8px',
    border: '2px solid #4B5563',
    resize: 'none',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const speechBoxStyle = {
    padding: '16px',
    backgroundColor: '#1F2937',
    borderRadius: '8px',
    minHeight: '80px',
    border: '2px dashed #6B7280',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  };

  const responseBoxStyle = {
    padding: '16px',
    backgroundColor: '#1F2937',
    borderRadius: '8px',
    minHeight: '80px',
    border: '2px solid #7C3AED'
  };

  const statusStyle = {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: '14px',
    marginTop: '24px'
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={fancyTitleStyle}>
          Sales AI Assistant
        </h1>
        
        {/* Control Bar */}
        <div style={controlBarStyle}>
          <button
            onClick={toggleCall}
            style={{
              ...buttonStyle,
              backgroundColor: isCallActive ? '#DC2626' : '#16A34A',
              color: 'white'
            }}
          >
            {isCallActive ? <PhoneOff size={16} /> : <Phone size={16} />}
            {isCallActive ? 'End Call' : 'Start Call'}
          </button>
          
          <button
            onClick={toggleRecording}
            disabled={!isCallActive}
            style={{
              ...buttonStyle,
              backgroundColor: isRecording ? '#EF4444' : '#2563EB',
              color: 'white',
              opacity: !isCallActive ? 0.5 : 1,
              cursor: !isCallActive ? 'not-allowed' : 'pointer'
            }}
          >
            {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
          
          <button
            onClick={() => generateAIResponse()}
            disabled={!isCallActive || isGenerating}
            style={{
              ...buttonStyle,
              backgroundColor: '#7C3AED',
              color: 'white',
              opacity: (!isCallActive || isGenerating) ? 0.5 : 1,
              cursor: (!isCallActive || isGenerating) ? 'not-allowed' : 'pointer'
            }}
          >
            <Settings size={16} />
            {isGenerating ? 'Generating...' : 'Generate AI Response'}
          </button>
          
          <button
            onClick={testAddEndpoint}
            style={{
              ...buttonStyle,
              backgroundColor: '#6B7280',
              color: 'white'
            }}
          >
            Test Backend
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div style={gridStyle}>
        {/* Left Column - Call Transcript */}
        <div>
          <Panel title="Call Transcript">
            <div style={transcriptStyle}>
              {transcript.map((entry, index) => (
                <div key={index} style={{
                  ...transcriptEntryStyle,
                  borderLeftColor: entry.speaker === 'AI Suggestion' ? '#7C3AED' : 
                                   entry.speaker === 'System' ? '#16A34A' : '#60A5FA'
                }}>
                  <div style={speakerStyle}>{entry.speaker}:</div>
                  <div style={{color: '#E5E7EB'}}>{entry.text}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Middle Column - Speech to Text & AI Response */}
        <div>
          <Panel title="Speech to Text">
            <div style={speechBoxStyle}>
              <p style={{color: '#E5E7EB', margin: 0, textAlign: 'center'}}>
                {speechText}
              </p>
              {isRecording && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#F87171'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#F87171',
                    borderRadius: '50%',
                    animation: 'pulse 1s infinite'
                  }}></div>
                  <span style={{fontSize: '12px'}}>Recording...</span>
                </div>
              )}
            </div>
            
            {/* Add CSS for pulse animation */}
            <style>
              {`
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.5; }
                }
              `}
            </style>
          </Panel>
          
          <Panel title="AI Response Suggestion">
            <div style={responseBoxStyle}>
              <p style={{color: '#D1D5DB', marginBottom: '12px'}}>{aiResponse}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(aiResponse);
                  alert("Response copied to clipboard!");
                }}
                style={{
                  fontSize: '12px',
                  backgroundColor: '#7C3AED',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Copy Response
              </button>
            </div>
          </Panel>
        </div>

        {/* Right Column - Call Notes */}
        <div>
          <Panel title="Call Notes">
            <div>
              <textarea
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                placeholder="Enter your call notes here..."
                style={textAreaStyle}
              />
              <button
                onClick={saveNotes}
                style={{
                  ...buttonStyle,
                  backgroundColor: '#16A34A',
                  color: 'white',
                  width: '100%',
                  justifyContent: 'center',
                  marginTop: '16px'
                }}
              >
                <Save size={16} />
                Save Notes
              </button>
            </div>
          </Panel>
        </div>
      </div>

      {/* Status Bar */}
      <div style={statusStyle}>
        Status: {isCallActive ? (
          <span style={{color: '#16A34A'}}>Call Active</span>
        ) : (
          <span style={{color: '#9CA3AF'}}>Call Inactive</span>
        )} | Recording: {isRecording ? (
          <span style={{color: '#EF4444'}}>On</span>
        ) : (
          <span style={{color: '#9CA3AF'}}>Off</span>
        )}
      </div>
    </div>
  );
}

export default App;