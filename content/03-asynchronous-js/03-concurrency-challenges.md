---
title: "Concurrency Challenges"
pre: "3. "
weight: 30
date: 2018-08-24T10:53:26-05:00
---

Implementing concurrency in computing systems comes with some specific challenges.  Consider the multitasking approach where we have your text editor and your music player running at the same time.  As the text editor process yields to the music player, the data and program elements it had loaded up into working memory, needs to be cleared out and replaced with the music player's data and program.  However, the music player's data and program need to be retained _somewhere_ so that they can be swapped back in when the music player yields.

Modern operating systems handle this challenge by dividing working memory amongst all programs running (which is why the more programs you run, the more RAM you consume).  Each running process is assigned a block of memory and _only_ allowed to use that memory.  Moreover, data copied into the CPU (the L2 cache, L1 cache, and registers) may also be cached in memory for later restoration.  You'll learn more about the details of this process if you take an Operating Systems course.  But it is _very_ important that each running program is _only_ allowed to make changes in its own assigned memory space.  If it wasn't, it could overwrite the data of another task!

{{% notice info %}}
In fact, an OS allowing a running program to overwrite another program's assigned memory is a _security vulnerability_, as this can involve overwriting part of the other _program_, changing how it actually works!  Viruses, trojans, and worms are often written to exploit this kind of vulnerability.
{{% /notice %}}

While operating sytems normally manage the challenges of concurrency between running programs, when the program _itself_ is written to be concurrent, the program itself must be built to avoid accidentally overwriting its own memory in unexpected ways.  Consider a text editor - it might have its main thread handling user input, and a second thread handling spell checking.  Now the user has typed "A quick brow", and the spell checker is finding that "brow" is misspelled.  It might try to underline the line in red, but in the intervening time, the user has deleted "brow", so the underlining is no longer valid!

Or consider image data.  Applying a filter to an image is a computationally costly operation - typically requiring visiting each pixel in the image, and for some filters, visiting each pixel _around_ each pixel as part of the transformation.  This would be a good use-case for multi-threading.  But now imagine _two_ filters working in parallel.  One might be applying a blur, and the other a grayscale transformation.  If they were overwriting the old image data with their new filtered version, and were working at the same time, they might both start from the original pixels in the upper-right-hand corner.  The blur would take longer, as it needs to visit neighboring pixels.  So the grayscale filter writes out the first hundred pixels, and then the blur writes out its first hundred, over-writing the grayed pixels with blurred color pixels.  Eventntually, the grayscale filter will get so far ahead of the blur filter that the blur filter will be reading in now-greyed out pixels, and blurring them.  The result could well be a mismash of blurred color and gray-and-white splotches.

There are many different approaches that can be used to manage this challenge.  One is the use of locks - locking a section of memory so only one thread can access it while it makes changes.  In the filter example, the grayscale filter could lock the image data, forcing the blur filter to wait until it finishes.  Locks work well, but must be carefully designed to avoid race conditions - where two threads cannot move forward because the other thread has already locked a resource the blocked thread needs to finish its work.

Asynchronous programming is another potential solution, which we'll look at next.