export default function LoginForm() {
   
    return (
    <div className='flex items-center justify-center'>
        <form className="bg-cyan-300 p-8 rounded-lg ">
            
                <h1 className="flex items-center justify-center text-3xl pb-4"> Log in Horizon Airline</h1>
                <div className="grid grid-cols-2 pt-4 pb-2">
                    <label className="flex justify-center" htmlFor="username">Username:</label>
                    <input
                    type="text"
                    id="username"
                    name="username"
                    className='rounded-lg'
                    />
                </div>
                <div className="grid grid-cols-2 pt-2 pb-4">
                    <label className="flex justify-center" htmlFor="password">Password:</label>
                    <input
                    type="password"
                    id="password"
                    name="password"
                    className='rounded-lg'
                    />
                </div>
                <div className="flex items-center justify-center pt-2">
                    <button type="submit" className="justify-center rounded-full bg-cyan-700 pt-1 pb-1 pl-5 pr-5 text-sm font-extrabold text-white hover:bg-cyan-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-800">
                        Login
                    </button>
                </div>
            
        </form>
    </div>
    );
}