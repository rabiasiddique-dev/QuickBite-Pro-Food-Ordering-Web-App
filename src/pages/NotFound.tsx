import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading, Text, Button } from '@/components/atoms';
import { Sparkles } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white transition-colors duration-300">
      <Heading as="h1" size="2xl" className="text-primary font-medium mb-2 animate-pulse">404</Heading>
      <Heading as="h2" size="sm" className="font-medium mb-4 flex items-center gap-1.5 justify-center">
        <Sparkles className="h-5 w-5 text-primary" />
        Oops! Page Lost in the Kitchen
      </Heading>
      <Text className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm leading-relaxed">
        The page you are looking for has been devoured, or it was never on the menu. Letâ€™s head back to get some real food!
      </Text>
      <Button onClick={() => navigate('/')} variant="primary">
        Back to Home
      </Button>
    </div>
  );
};

export default NotFound;
