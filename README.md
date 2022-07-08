# Evolutionary Image Generator
    A generator that utilises mutation to give randomised rectangles a legible shape
    Author: Divyansh Khare
    Credit: Adam Smith

#### 3 different inspiration images (and results that correspond to each): 3 pts
    Three images include:
	    ![Football](./assets/football.png)
	    ![Abstract Art](./assets/abstract.png)
	    ![Firefox symbol](./assets/firefox.png)

#### Explanation of design parameter choices: 2 pts
    -utilise rectangles to render basic pixels
    -the image is divided into a grid row and column wise
    -each cell of the grid is individually filled with rectangles within its bounds


#### Explanation of mutation approach: 2 pts
    I am attempting to change the parameter values for my inspiration based upon the rate using
    Adam Smith's function which utilises constraint and random gaussian function,
    The random gaussian function returns a random number fitting a Gaussian, or normal, distribution.
    This is an approach to propagate the rectangles in a symmetric format and minimising overlap. 
    The mutation rate is factored into the gaussian function to increase or decrease the resultant value.
    This value is then constrained between a minimum and maximum value and returned to the paramter as an arguement which 
    is its final value 

    Such an approach idolises the pixel generation in a more variable format.  

### Artist statement + what worked, what didn't: 2 pt
    I tried to design the pre existing inspirations to be a bit more artistic than the original image. 
    I tried to make it more colourful and more interesting. Instead of using the original pixel based image generation where each pixel has a fixed length and breadth, I used ractangles
    to generate the pixels. I also used the mutation rate to change the size of the rectangles.
    This was a success and achieved a nice abstraction of the original image.
    The problem was understanding how the fitness function worked and the way the mutation rate was being used. Being able to tweak the fitness function might achieve more artistic results.