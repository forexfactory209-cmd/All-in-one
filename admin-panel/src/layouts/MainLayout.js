import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import AddGuestPopup from '../pages/Users/popups/AddGuestPopup';
import AddPropertyPopup from '../pages/Properties/popups/AddPropertyPopup';
import './MainLayout.css';

const MainLayout = ({ children }) => {
    const [isPinned, setIsPinned] = useState(false);
    const [showAddGuest, setShowAddGuest] = useState(false);
    const [showAddProperty, setShowAddProperty] = useState(false);

    return (
        <div className={`main-layout ${isPinned ? 'sidebar-pinned' : 'sidebar-collapsed'}`}>
            <Sidebar isPinned={isPinned} setIsPinned={setIsPinned} />
            <main className="content-area">
                <div className="page-content">
                    {children}
                </div>
            </main>

            <AddGuestPopup
                isOpen={showAddGuest}
                onClose={() => setShowAddGuest(false)}
            />
            <AddPropertyPopup
                isOpen={showAddProperty}
                onClose={() => setShowAddProperty(false)}
            />
        </div>
    );
};

export default MainLayout;
