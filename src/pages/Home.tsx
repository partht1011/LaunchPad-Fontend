import TabBar from './../components/TabBar';
import IDOList from './../components/IDOList';
import { useState } from 'react';
function HomePage() {
  const [activeTab, setActiveTab] = useState(0); // State to manage active tab
  return (
    <main className="flex-grow mt-[100px] px-[200px]">
      <section>
        <TabBar
          activeTab={activeTab}
          onTabChange={(newActiveTab) => setActiveTab(newActiveTab)}
        />
        <IDOList activeTab={activeTab} />
      </section>
    </main>
  );
}

export default HomePage;
