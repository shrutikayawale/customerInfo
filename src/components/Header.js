import contact from '../media/contact.jpg';

export const Header = () => {
    return <div style={{display: 'flex', padding: '10px'}}>
        <img src={contact} alt="" width="50" height="50" />  
        <h3>Applications</h3>
    </div>
};

