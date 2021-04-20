# BOILERPLATE DIRECTIONS

- clone with command `npx degit githubusername/githubreponame#branchname projectName`

- cd into new project folder

- run `npm install` to install dependencies

- rename template.env to .env

- make sure to replace MONGODB_URL with a working Mongo URL

- API Axios call still not complete. 

## The Basic Idea 
### A Tinder like UX that allows the user to shuffle through nonprofit organizations and easily donate to causes of their choice. 

## Difficulties 
I did't want a seperate show page, so the index page provides all Crud. Made the steps a bit confusing in the routers.  

Understanding the /:id as the holder of my req.params saved in the url.  

Was'nt able to create a API that would fill in the donations tab minus the amount donated. 

- I used postman to vet the `global giving` sample api that was setup for xml but has a json option

Left donation amount out for now, due to time constraints in completeing MVP. 

When deployed to Heroku I made my npm run dev the node call. Needed to be npm run start. 

I wanted to challange myslef with seperating the controllers and the routers but ended up packing the home.js route with all AUTH and crud routes. 

# `Global Giving` does exactly what I want minus the UX - if you are interested in becoming an "easy- philanthropist:)"

Thank you
- Cameron Lucas 
- Marialaina
- Tani 
- Ray Velasquez
- Mickey Vershbow 
- Garret Dunlap 
- Mathew Turner
- Alex Merced 
and Ira Herman 