import React from 'react'

function Footer() {
  return (
    <footer className="text-center text-sm py-4  bottom-0 w-full bg-zinc-900 text-white p-6 flex  justify-center">
  <a href="/terms" className="hover:underline mx-2">Terms</a> | 
  <a href="/privacy" className="hover:underline mx-2">Privacy</a>
</footer>
  )
}

export default Footer