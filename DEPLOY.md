# How to deploy to google cloud

## Make local build

`gulp build`

## Rsync local build to bucket

`gsutil -m rsync -r -d build/ gs://www.wllnr.nl`


# Create and configure new bucket

`gsutil mb -l "EU" gs://www.example.com`

## Set web config
`gsutil setwebcfg -m index.html -e 404.html gs://www.wllnr.nl`

## Set public read
`gsutil -m setacl -R -a public-read gs://www.wllnr.nl`

## Default public read
`gsutil setdefacl public-read gs://www.wllnr.nl`

(source: http://www.maartenjan.org/artikelen/2013-07-02-hosting-static-websites-on-google-cloud-storage.html)