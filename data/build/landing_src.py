"""Hand-written content for data/landing.json (backend part 6).

build_landing.py turns this into data/landing.json and fails if any quote is
not word for word in its saved NASA page. `text` is written plain English for
the card; the `quote` under it is NASA's own words and backs every fact in it.
The incident cards are not ranked evidence and do not count toward strength.
"""

A1_FIRE = "https://www.nasa.gov/history/55-years-ago-the-apollo-1-fire-and-its-aftermath/"
A13_BOARD = "https://www.nasa.gov/history/50-years-ago-apollo-13-review-board-report/"
MIR_FIRE = "https://www.nasa.gov/history/25-years-ago-fire-aboard-space-station-mir/"
STRANGE_FLAMES = "http://web.archive.org/web/20230602193621id_/https://science.nasa.gov/science-news/science-at-nasa/2013/18jun_strangeflames/"

INCIDENTS = [
    {
        "id": "apollo-1",
        "year": "1967",
        "name": "Apollo 1",
        "text": "During a launch pad test, a flash fire broke out in the sealed cabin, filled with pure oxygen. All three astronauts died.",
        "quote": "Because of the pure oxygen atmosphere, pressurized to 16.7 psi – two pounds above atmospheric pressure and a larger-than-allowable amount of flammable material in the spacecraft – the fire spread very rapidly.",
        "source": A1_FIRE,
        "sourceTitle": "NASA History: 55 Years Ago: The Apollo 1 Fire and its Aftermath",
        # Facts in `text` that the quote does not carry, each word for word on the same page.
        "support": [
            "At 6:31 p.m., a flash fire broke out inside the cabin.",
            "By the time they opened the hatches, the crew had already perished.",
        ],
    },
    {
        "id": "apollo-13",
        "year": "1970",
        "name": "Apollo 13",
        "text": "On the way to the Moon, damaged wiring in an oxygen tank shorted, a spark set off combustion inside the tank, and the tank burst. The crew made it home.",
        "quote": "They had stirred the oxygen tanks on two previous occasions during the mission with only erratic pressure readings, but this time, likely due to the damaged Teflon insulation, a short-circuit occurred triggering a spark resulting in a combustion event.",
        "source": A13_BOARD,
        "sourceTitle": "NASA History: 50 Years Ago: Apollo 13 Review Board Report",
        "support": [
            "The pressure tank lost integrity and the oxygen escaping at high velocity caused the panel covering bay 4 to be blown off.",
            "while traveling 205,000 miles from Earth toward the Moon, an explosion rocked the Apollo 13 spacecraft",
            "successfully splashed down in the Pacific Ocean on April 17",
        ],
    },
    {
        "id": "mir",
        "year": "1997",
        "name": "Mir",
        "text": "An oxygen generator caught fire, blocked the way to an escape craft and filled the station with smoke. The crew put it out, with no lasting harm.",
        "quote": "On Feb. 24, 1997, the six crew members aboard the Russian space station Mir faced significant danger when a fire ignited in an oxygen generating system.",
        "source": MIR_FIRE,
        "sourceTitle": "NASA History: 25 Years Ago: Fire Aboard Space Station Mir",
        "support": [
            "The searing flame, lasting several minutes, not only cut off access to one of the two Soyuz escape vehicles but also filled the station’s modules with smoke.",
            "the crew prevailed and extinguished the flames",
            "with no lasting harm to the crew members",
        ],
    },
]

# The landing's video link. The original NASA page now returns 404, so the
# quote is checked against the Internet Archive copy (snapshot June 2, 2023);
# `nasaUrl` is the original address, `url` is the video it links to.
VIDEO = {
    "title": "Strange Flames on the ISS",
    "url": "https://www.youtube.com/watch?v=BxxqCLxxY3M",
    "nasaUrl": "https://science.nasa.gov/science-news/science-at-nasa/2013/18jun_strangeflames/",
    "quote": 'A new ScienceCast video explores the surprising behavior of "cool flames" on the International Space Station.',
    "source": STRANGE_FLAMES,
    "sourceTitle": "NASA Science: Strange Flames on the ISS (archived copy)",
}
