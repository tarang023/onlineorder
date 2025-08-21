// app/page.js 
import CustomerLoginRegister from "./customer-login-register/page";
import LogginButtons from './logginButton/logginButton'

export default function HomePage() {
  return (
    <main>
      <h1 className="text-3xl font-bold underline">
       
      </h1>
      {/* <LogginButtons /> */}
      <CustomerLoginRegister />
      {/* Your other components and content go here */}
    </main>
  );
}
