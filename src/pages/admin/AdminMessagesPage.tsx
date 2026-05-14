import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Flame, CheckCircle2, Circle, Mail } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type ContactMessage = Tables<"contact_messages">;

const AdminMessagesPage = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/");
  }, [user, isAdmin, authLoading, navigate]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setMessages(data);
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchMessages().then(() => setLoadingData(false));
    }
  }, [user, isAdmin]);

  const handleUpdateMessageStatus = async (messageId: string, status: string) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ status })
      .eq("id", messageId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `Message marked as ${status}` });
    fetchMessages();
  };

  if (authLoading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Flame className="w-8 h-8 text-primary animate-pulse" />
      </div>
    );
  }

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="min-h-screen bg-gradient-smoke">
      <Navbar />
      <div className="pt-24 md:pt-32 pb-16 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="font-display text-3xl md:text-5xl font-bold bg-clip-text text-gradient-fire pb-2">
              Messages
            </h1>
            <div className="bg-card/80 border border-border rounded-2xl px-6 py-3 shadow-card text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Unread Messages</p>
              <p className="text-2xl mt-1 font-display font-bold text-primary">
                {unreadCount}
              </p>
            </div>
          </div>

          {messages.length === 0 ? (
            <p className="text-muted-foreground text-center py-12 bg-card rounded-2xl border border-border">
              No messages yet
            </p>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`bg-card/90 backdrop-blur border rounded-2xl p-6 shadow-card transition-all ${
                    msg.status === 'unread' ? 'border-primary ring-1 ring-primary/20' : 'border-border'
                  }`}
                >
                  <div className="flex flex-col md:flex-row gap-6 justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-display text-xl md:text-2xl font-bold">{msg.name}</h4>
                        {msg.status === 'unread' && (
                          <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/30 uppercase tracking-widest">
                            New
                          </span>
                        )}
                      </div>
                      <div className="text-sm md:text-base text-muted-foreground mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-4 gap-y-2">
                        <span className="flex bg-secondary px-3 py-1 rounded-lg w-fit">{msg.email}</span>
                        {msg.phone && <span className="flex bg-secondary px-3 py-1 rounded-lg w-fit">{msg.phone}</span>}
                        <span className="text-xs block mt-1 sm:mt-0 sm:ml-auto">
                          {new Date(msg.created_at || '').toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${msg.email}&su=${encodeURIComponent('Reply to your inquiry at Meerut Famous Kabab Paratha')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 justify-center rounded-xl text-sm font-medium transition-colors flex items-center gap-2 flex-1 sm:flex-none"
                      >
                        <Mail className="w-4 h-4" /> Reply
                      </a>
                      {msg.status === 'unread' ? (
                        <button
                          onClick={() => handleUpdateMessageStatus(msg.id, "read")}
                          className="bg-primary text-primary-foreground hover:opacity-90 px-4 py-2 justify-center rounded-xl text-sm font-medium transition-colors flex items-center gap-2 flex-1 sm:flex-none"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Mark Read
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateMessageStatus(msg.id, "unread")}
                          className="bg-secondary hover:bg-muted text-secondary-foreground px-4 py-2 justify-center rounded-xl text-sm font-medium transition-colors flex items-center gap-2 flex-1 sm:flex-none"
                        >
                          <Circle className="w-4 h-4" /> Mark Unread
                        </button>
                      )}
                      <button
                        onClick={async () => {
                          if (confirm("Delete this message?")) {
                            await supabase.from("contact_messages").delete().eq("id", msg.id);
                            fetchMessages();
                          }
                        }}
                        className="bg-destructive/10 hover:bg-destructive/20 text-destructive px-4 py-2 justify-center rounded-xl text-sm font-medium transition-colors flex-1 sm:flex-none"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="bg-secondary/40 p-5 rounded-xl text-foreground/90 whitespace-pre-wrap border border-border/50 text-base md:text-lg leading-relaxed">
                    {msg.message}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminMessagesPage;