import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface StoryModalProps {
  summary: string;
  storyText: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function StoryModal({
  summary,
  storyText,
  open,
  setOpen,
}: StoryModalProps) {
  return (
    <Transition.Root show={open} as={Fragment}>
      {/** set onClose to setOpen to close the modal when the overlay is clicked */}
      <Dialog as='div' className='relative z-10' onClose={() => false}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6'>
                <div>
                  <div className='mt-3 text-center sm:mt-5'>
                    <Dialog.Title
                      as='h3'
                      className='font-semibold leading-6 text-gray-900 text-xl'
                    >
                      {summary}
                    </Dialog.Title>
                    <div className='flex flex-col w-full'>
                      <div className='divider divider-primary'></div>
                    </div>
                    <div className='mt-2'>
                      <p className='text-xl text-gray-500'>{storyText}</p>
                      {/* <p className='text-xl text-gray-500'>{'Title: "The Unlikely Heroes"\n\nIn a world where animals talk and adventure awaits, a dog named Max and a turtle named Shelly set out on a quest to rescue Princess Daisy, a duck captured by the evil magpie, Captain Beak. Max, known for his bravery, and Shelly, for her wisdom, make an unconventional but determined duo.\n\nThrough forests and over mountains, they faced challenges like quicksand and giant spiders. Max\'s speed and Shelly\'s strategy helped them navigate the dangers. Along the way, they met new friends who joined their mission.\n\nFinally, they reached Captain Beak\'s fortress. With a clever plan, they outsmarted the magpie and rescued Princess Daisy. The grateful Princess led them back home, where they were hailed as heroes.\n\nIn the end, Max and Shelly taught everyone that true courage comes in all shapes and sizes, and that sometimes the most unlikely heroes can save the day.'}</p> */}
                    </div>
                  </div>
                </div>
                <div className='mt-5 sm:mt-6'>
                  <button
                    type='button'
                    className='inline-flex w-full justify-center rounded-md bg-slate-600 px-3 py-2 text-lg font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600'
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
