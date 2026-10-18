import { ReactNode, createContext, useContext, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

type ActiveMode = 'tow' | 'service';

interface LayoutContextType {
  activeMode: ActiveMode;
  setActiveMode: (mode: ActiveMode) => void;
}

const LayoutContext = createContext<LayoutContextType>({
  activeMode: 'tow',
  setActiveMode: () => {},
});

export const useLayoutMode = () => useContext(LayoutContext);

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [activeMode, setActiveMode] = useState<ActiveMode>('tow');

  return (
    <LayoutContext.Provider value={{ activeMode, setActiveMode }}>
      <div className="min-h-screen flex flex-col">
        <Header activeMode={activeMode} />
        <main className="flex-1 pt-20">
          {children}
        </main>
        <Footer />
      </div>
    </LayoutContext.Provider>
  );
}
