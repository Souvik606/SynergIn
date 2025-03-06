import { Link } from "react-router-dom";
import SignUpForm from "../../components/auth/SignUpForm";

const SignUpPage = () => {
  return (
    <div className='min-h-[85vh] rounded-3xl flex flex-col justify-center sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md '>
        <img className='mx-auto h-20 w-auto' src='/logo.svg' alt='SynergIn' />
        <h2 className='text-center text-3xl font-bold text-gray-900 pt-4'>
          Make the most of your professional life
        </h2>
      </div>
      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md shadow-md'>
        <div className='bg-white pt-8 pb-4 px-4 shadow sm:rounded-lg sm:px-10'>
          <SignUpForm />

          <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-lg font-semibold text-gray-500'>Already on SynergIn?</span>
              </div>
            </div>
            <div className='mt-4'>
              <Link
                to='/login'
                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-xl font-bold text-blue-600 bg-white hover:bg-gray-50'
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
