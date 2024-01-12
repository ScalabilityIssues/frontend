export default function LoginForm() {
   
    return (
    <div className='flex items-center justify-center'>
        <form className="bg-blue-200 p-8 rounded-lg ">
            <div className="grid grid-cols-1 ">
                <h1> Login Page</h1>
                <div className="grid grid-cols-2 pt-4 pb-2">
                    <label htmlFor="username">Username:</label>
                    <input
                    type="text"
                    id="username"
                    name="username"
                    className='rounded-lg'
                    />
                </div>
                <div className="grid grid-cols-2 pt-2 pb-4">
                    <label htmlFor="password">Password:</label>
                    <input
                    type="password"
                    id="password"
                    name="password"
                    className='rounded-lg'
                    />
                </div>
                <div className="flex items-center justify-center">
                    <button type="submit" className="justify-center rounded-lg bg-blue-700 pl-6 pr-6 text-sm font-extrabold text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800">
                        Login
                    </button>
                </div>
            </div>
        </form>
    </div>
    );
}